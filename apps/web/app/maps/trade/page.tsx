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
  const [animate, setAnimate] = useState(false);
  const svgRef = useRef(null);

  useEffect(() => {
    setAnimate(true);
    const interval = setInterval(() => {
      if (flowAnimation) {
        setAnimatedRoutes(prev => new Set(Math.random() > 0.5 ? ['route1', 'route2'] : ['route3', 'route4']));
        setPulsingCities(prev => new Set(Math.random() > 0.5 ? ['athens', 'alexandria'] : ['rome', 'byzantion']));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [flowAnimation]);

  const eraColors = {
    archaic: '#D97706',
    classical: '#F59E0B',
    hellenistic: '#3B82F6',
    imperial: '#DC2626',
    'late-antique': '#7C3AED',
    byzantine: '#059669'
  };

  const eraNames = {
    archaic: 'Archaic Period (800-500 BCE)',
    classical: 'Classical Period (500-323 BCE)', 
    hellenistic: 'Hellenistic Period (323-31 BCE)',
    imperial: 'Imperial Period (31 BCE-284 CE)',
    'late-antique': 'Late Antique (284-600 CE)',
    byzantine: 'Byzantine Period (600-1453 CE)'
  };

  const routes = {
    archaic: [
      { id: 1, name: 'Via Pontica', start: { x: 200, y: 180 }, end: { x: 400, y: 160 }, type: 'maritime', goods: ['grain', 'wine', 'pottery'], description: 'Black Sea coastal route connecting Greek colonies', flow: 'high', value: 1200 },
      { id: 2, name: 'Phoenician Circuit', start: { x: 100, y: 240 }, end: { x: 300, y: 220 }, type: 'maritime', goods: ['purple', 'cedar', 'glass'], description: 'Western Mediterranean trade network', flow: 'medium', value: 800 },
      { id: 3, name: 'Amber Path', start: { x: 280, y: 120 }, end: { x: 260, y: 240 }, type: 'overland', goods: ['amber', 'furs'], description: 'Early amber trade from northern Europe', flow: 'low', value: 400 }
    ],
    classical: [
      { id: 4, name: 'Via Pontica', start: { x: 200, y: 180 }, end: { x: 400, y: 160 }, type: 'maritime', goods: ['grain', 'wine', 'pottery'], description: 'Expanded Black Sea trade under Athenian hegemony', flow: 'very-high', value: 2500 },
      { id: 5, name: 'Amber Road', start: { x: 300, y: 120 }, end: { x: 280, y: 280 }, type: 'overland', goods: ['amber', 'furs', 'metals'], description: 'Overland route from Baltic to Mediterranean', flow: 'high', value: 1500 },
      { id: 6, name: 'Trans-Alpine', start: { x: 250, y: 200 }, end: { x: 300, y: 160 }, type: 'overland', goods: ['metals', 'salt', 'wool'], description: 'Alpine passes connecting Gaul and Italy', flow: 'medium', value: 900 },
      { id: 7, name: 'Aegean Network', start: { x: 320, y: 200 }, end: { x: 360, y: 220 }, type: 'maritime', goods: ['wine', 'pottery', 'oil'], description: 'Island-hopping trade in the Aegean', flow: 'high', value: 1800 }
    ],
    hellenistic: [
      { id: 8, name: 'Alexandria-Rhodes', start: { x: 380, y: 300 }, end: { x: 360, y: 220 }, type: 'maritime', goods: ['papyrus', 'grain', 'glass'], description: 'Ptolemaic trade axis', flow: 'very-high', value: 3000 },
      { id: 9, name: 'Bactrian Route', start: { x: 520, y: 160 }, end: { x: 580, y: 140 }, type: 'overland', goods: ['silk', 'horses', 'gems'], description: 'Silk Road through Greek Bactria', flow: 'high', value: 2200 },
      { id: 10, name: 'Red Sea Route', start: { x: 420, y: 320 }, end: { x: 480, y: 280 }, type: 'maritime', goods: ['incense', 'spices', 'ivory'], description: 'Indian Ocean trade via Ptolemaic ports', flow: 'high', value: 2000 },
      { id: 11, name: 'Seleucid Axis', start: { x: 400, y: 240 }, end: { x: 500, y: 200 }, type: 'overland', goods: ['spices', 'silk', 'gems'], description: 'Mesopotamian trade corridor', flow: 'medium', value: 1300 }
    ],
    imperial: [
      { id: 12, name: 'Via Maris', start: { x: 400, y: 280 }, end: { x: 500, y: 240 }, type: 'overland', goods: ['spices', 'incense', 'textiles'], description: 'Roman control of Eastern trade routes', flow: 'high', value: 1900 },
      { id: 13, name: 'Roman Egyptian Route', start: { x: 380, y: 300 }, end: { x: 200, y: 180 }, type: 'maritime', goods: ['grain', 'papyrus', 'glass'], description: 'Vital supply lines from Egypt to Rome', flow: 'very-high', value: 3500 },
      { id: 14, name: 'Via Appia', start: { x: 240, y: 260 }, end: { x: 280, y: 200 }, type: 'overland', goods: ['wine', 'oil', 'metals'], description: 'Roman road connecting Rome to southern Italy', flow: 'high', value: 1600 }
    ],
    'late-antique': [
      { id: 15, name: 'Rhine Trade', start: { x: 200, y: 160 }, end: { x: 250, y: 200 }, type: 'river', goods: ['grain', 'wine', 'amber'], description: 'Trade along the Rhine River', flow: 'medium', value: 700 },
      { id: 16, name: 'Danube Route', start: { x: 300, y: 150 }, end: { x: 400, y: 160 }, type: 'river', goods: ['furs', 'slaves', 'amber'], description: 'Danube river trade network', flow: 'medium', value: 800 }
    ],
    byzantine: [
      { id: 17, name: 'Silk Road Terminal', start: { x: 500, y: 200 }, end: { x: 350, y: 180 }, type: 'overland', goods: ['silk', 'spices', 'gold'], description: 'Byzantine control of Silk Road endpoints', flow: 'high', value: 2800 },
      { id: 18, name: 'Mediterranean Circuit', start: { x: 350, y: 180 }, end: { x: 220, y: 220 }, type: 'maritime', goods: ['silk', 'spices', 'wine'], description: 'Byzantine maritime dominance', flow: 'high', value: 2200 }
    ]
  };

  const cities = [
    { name: 'Athens', greekName: 'Ἀθῆναι', x: 340, y: 220, type: 'polis', era: ['archaic', 'classical'], goods: ['pottery', 'oil', 'wine'], importance: 'major', population: 250000 },
    { name: 'Alexandria', greekName: 'Ἀλεξάνδρεια', x: 380, y: 300, type: 'metropolis', era: ['hellenistic', 'imperial'], goods: ['papyrus', 'grain', 'glass'], importance: 'major', population: 400000 },
    { name: 'Rhodes', greekName: 'Ῥόδος', x: 360, y: 220, type: 'polis', era: ['hellenistic'], goods: ['wine', 'pottery'], importance: 'medium', population: 60000 },
    { name: 'Byzantion', greekName: 'Βυζάντιον', x: 350, y: 180, type: 'metropolis', era: ['byzantine'], goods: ['silk', 'spices'], importance: 'major', population: 500000 },
    { name: 'Rome', greekName: 'Ῥώμη', x: 280, y: 200, type: 'metropolis', era: ['imperial'], goods: ['wine', 'metals'], importance: 'major', population: 1000000 },
    { name: 'Ephesos', greekName: 'Ἔφεσος', x: 380, y: 190, type: 'polis', era: ['classical', 'hellenistic'], goods: ['textiles', 'gems'], importance: 'medium', population: 200000 },
    { name: 'Antioch', greekName: 'Ἀντιόχεια', x: 420, y: 240, type: 'metropolis', era: ['hellenistic', 'imperial'], goods: ['spices', 'silk'], importance: 'major', population: 300000 }
  ];

  const tradeGoods = [
    { name: 'Grain', value: 'high', color: '#F59E0B', regions: ['Egypt', 'Black Sea', 'Sicily'], volume: 'very-high' },
    { name: 'Wine', value: 'medium', color: '#7C2D12', regions: ['Greece', 'Italy', 'Gaul'], volume: 'high' },
    { name: 'Pottery', value: 'low', color: '#EA580C', regions: ['Athens', 'Corinth'], volume: 'medium' },
    { name: 'Silk', value: 'very-high', color: '#DC2626', regions: ['China', 'Persia'], volume: 'low' },
    { name: 'Spices', value: 'very-high', color: '#B91C1C', regions: ['India', 'Arabia'], volume: 'low' },
    { name: 'Amber', value: 'high', color: '#D97706', regions: ['Baltic'], volume: 'low' },
    { name: 'Papyrus', value: 'medium', color: '#059669', regions: ['Egypt'], volume: 'medium' },
    { name: 'Purple Dye', value: 'very-high', color: '#7C3AED', regions: ['Phoenicia'], volume: 'very-low' },
    { name: 'Incense', value: 'high', color: '#C026D3', regions: ['Arabia', 'India'], volume: 'low' },
    { name: 'Metals', value: 'medium', color: '#6B7280', regions: ['Spain', 'Cyprus'], volume: 'medium' }
  ];

  const getRouteColor = (route) => {
    const baseColor = eraColors[selectedEra];
    const opacity = route.flow === 'very-high' ? 1 : route.flow === 'high' ? 0.8 : route.flow === 'medium' ? 0.6 : 0.4;
    return baseColor + Math.floor(opacity * 255).toString(16).padStart(2, '0');
  };

  const getRouteWidth = (route) => {
    switch(route.flow) {
      case 'very-high': return 8;
      case 'high': return 6;
      case 'medium': return 4;
      case 'low': return 2;
      default: return 2;
    }
  };

  const getCitySize = (city) => {
    switch(city.importance) {
      case 'major': return 16;
      case 'medium': return 12;
      case 'minor': return 8;
      default: return 8;
    }
  };

  const currentRoutes = routes[selectedEra] || [];
  const currentCities = cities.filter(city => city.era.includes(selectedEra));

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at 20% 80%, ${eraColors[selectedEra]}08 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, ${eraColors[selectedEra]}06 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, #C9A22705 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{
        position: 'relative',
        background: `linear-gradient(135deg, #1E1E24 0%, #141419 100%)`,
        borderBottom: `3px solid ${eraColors[selectedEra]}`,
        boxShadow: `
          0 10px 40px rgba(0, 0, 0, 0.5),
          inset 0 -1px 0 ${eraColors[selectedEra]}20
        `
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '2rem',
          position: 'relative'
        }}>
          {/* Decorative Elements */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '2rem',
            width: '100px',
            height: '100px',
            background: `conic-gradient(from 0deg, ${eraColors[selectedEra]}, transparent, ${eraColors[selectedEra]})`,
            borderRadius: '50%',
            opacity: 0.1,
            animation: 'spin 20s linear infinite'
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                margin: '0 0 0.5rem 0',
                background: `linear-gradient(135deg, #F5F4F2, ${eraColors[selectedEra]})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: `0 0 30px ${eraColors[selectedEra]}40`
              }}>
                Ancient Trade Routes
                <span style={{ color: '#3B82F6', marginLeft: '0.5rem' }}>Α</span>
              </h1>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '1.1rem',
                color: '#9CA3AF'
              }}>
                <span>Maritime & Overland Commerce</span>
                <div style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: eraColors[selectedEra]
                }} />
                <span>{eraNames[selectedEra]}</span>
              </div>
            </div>

            <Link href="/dashboard" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: `linear-gradient(135deg, ${eraColors[selectedEra]}20, ${eraColors[selectedEra]}10)`,
              border: `2px solid ${eraColors[selectedEra]}`,
              borderRadius: '12px',
              color: '#F5F4F2',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              transform: animate ? 'translateY(0)' : 'translateY(-20px)',
              opacity: animate ? 1 : 0,
              boxShadow: `
                0 4px 20px ${eraColors[selectedEra]}30,
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `
                0 8px 30px ${eraColors[selectedEra]}40,
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `;
              e.currentTarget.style.background = `linear-gradient(135deg, ${eraColors[selectedEra]}30, ${eraColors[selectedEra]}20)`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `
                0 4px 20px ${eraColors[selectedEra]}30,
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `;
              e.currentTarget.style.background = `linear-gradient(135deg, ${eraColors[selectedEra]}20, ${eraColors[selectedEra]}10)`;
            }}
            >
              <span style={{
                fontSize: '1.2rem'
              }}>←</span>
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem',
        position: 'relative'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Era Selector */}
          <div style={{
            background: `linear-gradient(135deg, #1E1E24 0%, #141419 100%)`,
            borderRadius: '16px',
            padding: '1.5rem',
            border: `1px solid ${eraColors[selectedEra]}30`,
            boxShadow: `
              0 10px 30px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.05)
            `
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              color: eraColors[selectedEra],
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>Historical Period</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem'
            }}>
              {Object.entries(eraNames).map(([key, name]) => (
                <button
                  key={key}
                  onClick={() => setSelectedEra(key as any)}
                  style={{
                    padding: '0.75rem',
                    background: selectedEra === key 
                      ? `linear-gradient(135deg, ${eraColors[key]}, ${eraColors[key]}80)`
                      : `linear-gradient(135deg, #1E1E24, #141419)`,
                    border: `2px solid ${selectedEra === key ? eraColors[key] : eraColors[key] + '30'}`,
                    borderRadius: '10px',
                    color: selectedEra === key ? '#000' : '#F5F4F2',
                    fontSize: '0.85rem',
                    fontWeight: selectedEra === key ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    boxShadow: selectedEra === key 
                      ? `0 4px 20px ${eraColors[key]}40, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                      : `0 2px 10px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
                  }}
                  onMouseOver={(e) => {
                    if (selectedEra !== key) {
                      e.currentTarget.style.border = `2px solid ${eraColors[key]}60`;
                      e.currentTarget.style.background = `linear-gradient(135deg, ${eraColors[key]}10, #141419)`;
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedEra !== key) {
                      e.currentTarget.style.border = `2px solid ${eraColors[key]}30`;
                      e.currentTarget.style.background = `linear-gradient(135deg, #1E1E24, #141419)`;
                    }
                  }}
                >
                  {name.split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Selector */}
          <div style={{
            background: `linear-gradient(135deg, #1E1E24 0%, #141419 100%)`,
            borderRadius: '16px',
            padding: '1.5rem',
            border: `1px solid ${eraColors[selectedEra]}30`,
            boxShadow: `
              0 10px 30px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.05)
            `
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              color: eraColors[selectedEra],
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>View Mode</h3>
            <div style={{
              display: 'flex',
              gap: '0.5rem'
            }}>
              {['routes', 'goods', 'cities'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: viewMode === mode 
                      ? `linear-gradient(135deg, ${eraColors[selectedEra]}, ${eraColors[selectedEra]}80)`
                      : `linear-gradient(135deg, #1E1E24, #141419)`,
                    border: `2px solid ${viewMode === mode ? eraColors[selectedEra] : eraColors[selectedEra] + '30'}`,
                    borderRadius: '10px',
                    color: viewMode === mode ? '#000' : '#F5F4F2',
                    fontSize: '0.9rem',
                    fontWeight: viewMode === mode ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    boxShadow: viewMode === mode 
                      ? `0 4px 20px ${eraColors[selectedEra]}40, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                      : `0 2px 10px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
                    textTransform: 'capitalize'
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Animation Controls */}
          <div style={{
            background: `linear-gradient(135deg, #1E1E24 0%, #141419 100%)`,
            borderRadius: '16px',
            padding: '1.5rem',
            border: `1px solid ${eraColors[selectedEra]}30`,
            boxShadow: `
              0 10px 30px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.05)
            `
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              color: eraColors[selectedEra],
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>Animation</h3>
            <button
              onClick={() => setFlowAnimation(!flowAnimation)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: flowAnimation 
                  ? `linear-gradient(135deg, ${eraColors[selectedEra]}, ${eraColors[selectedEra]}80)`
                  : `linear-gradient(135deg, #1E1E24, #141419)`,
                border: `2px solid ${flowAnimation ? eraColors[selectedEra] : eraColors[selectedEra] + '30'}`,
                borderRadius: '10px',
                color: flowAnimation ? '#000' : '#F5F4F2',
                fontSize: '0.9rem',
                fontWeight: flowAnimation ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: flowAnimation 
                  ? `0 4px 20px ${eraColors[selectedEra]}40, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                  : `0 2px 10px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
              }}
            >
              {flowAnimation ? 'Stop Animation' : 'Start Animation'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '2rem',
          minHeight: '800px'
        }}>
          {/* Map */}
          <div style={{
            background: `linear-gradient(135deg, #1E1E24 0%, #141419 100%)`,
            borderRadius: '20px',
            padding: '2rem',
            border: `1px solid ${eraColors[selectedEra]}30`,
            boxShadow: `
              0 20px 50px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.05)
            `,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Map Background Pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0.03,
              background: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  ${eraColors[selectedEra]} 10px,
                  ${eraColors[selectedEra]} 11px
                )
              `
            }} />

            <h2 style={{
              margin: '0 0 2rem 0',
              color: eraColors[selectedEra],
              fontSize: '1.5rem',
              fontWeight: '600',
              textAlign: 'center',
              textShadow: `0 0 20px ${eraColors[selectedEra]}40`
            }}>
              {eraNames[selectedEra]}
            </h2>

            <svg
              ref={svgRef}
              viewBox="0 0 800 500"
              style={{
                width: '100%',
                height: '500px',
                borderRadius: '12px',
                background: `
                  radial-gradient(circle at 30% 30%, ${eraColors[selectedEra]}05 0%, transparent 50%),
                  linear-gradient(135deg, #0D0D0F 0%, #1E1E24 100%)
                `
              }}
            >
              {/* Mediterranean Sea */}
              <ellipse
                cx="400"
                cy="250"
                rx="350"
                ry="180"
                fill={`${eraColors[selectedEra]}10`}
                stroke={`${eraColors[selectedEra]}30`}
                strokeWidth="1"
                strokeDasharray="5,5"
              />

              {/* Trade Routes */}
              {currentRoutes.map((route, index) => (
                <g key={route.id}>
                  {/* Route Path */}
                  <line
                    x1={route.start.x}
                    y1={route.start.y}
                    x2={route.