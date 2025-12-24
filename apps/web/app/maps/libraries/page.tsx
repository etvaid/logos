'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LibrariesMap() {
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [hoveredLibrary, setHoveredLibrary] = useState(null);
  const [viewMode, setViewMode] = useState('map');
  const [eraFilter, setEraFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showManuscripts, setShowManuscripts] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [particleAnimation, setParticleAnimation] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
    }, 50);
    const particleInterval = setInterval(() => {
      setParticleAnimation(prev => (prev + 0.5) % 100);
    }, 100);
    return () => {
      clearInterval(interval);
      clearInterval(particleInterval);
    };
  }, []);

  const libraries = [
    { 
      id: 1, 
      name: 'Library of Alexandria', 
      location: 'Alexandria, Egypt', 
      lat: 31.2, 
      lng: 29.9, 
      era: 'Hellenistic', 
      founded: '295 BCE', 
      description: 'Greatest library of the ancient world, part of the Mouseion', 
      scrolls: 700000,
      x: 520,
      y: 340,
      scholars: ['Eratosthenes', 'Apollonius of Rhodes', 'Callimachus', 'Euclid', 'Archimedes'],
      collections: ['Homer manuscripts', 'Mathematical treatises', 'Medical texts', 'Astronomical works', 'Geographical studies'],
      fate: 'Gradual decline from 3rd century CE',
      manuscripts: [
        { title: 'Iliad α-δ', author: 'Homer', variants: 42, apparatus: 'Critical edition with scholia' },
        { title: 'Elements', author: 'Euclid', variants: 15, apparatus: 'Geometric proofs with diagrams' }
      ],
      catalogSystem: 'Pinakes by Callimachus',
      preservation: 'Papyrus scrolls in cedar boxes',
      importance: 10
    },
    { 
      id: 2, 
      name: 'Library of Pergamon', 
      location: 'Pergamon, Asia Minor', 
      lat: 39.1, 
      lng: 27.2, 
      era: 'Hellenistic', 
      founded: '197 BCE', 
      description: 'Rival to Alexandria, invented parchment', 
      scrolls: 200000,
      x: 480,
      y: 260,
      scholars: ['Crates of Mallus', 'Apollodorus of Athens', 'Demetrius of Scepsis'],
      collections: ['Aristotelian texts', 'Stoic philosophy', 'Historical works', 'Grammatical treatises'],
      fate: 'Gifted to Cleopatra by Mark Antony',
      manuscripts: [
        { title: 'Metaphysics', author: 'Aristotle', variants: 28, apparatus: 'Peripatetic commentary tradition' },
        { title: 'Atthis', author: 'Apollodorus', variants: 12, apparatus: 'Historical chronography' }
      ],
      catalogSystem: 'Attalid royal registry',
      preservation: 'Parchment codices (pergamene invention)',
      importance: 8
    },
    { 
      id: 3, 
      name: 'Trajan\'s Library', 
      location: 'Rome', 
      lat: 41.9, 
      lng: 12.5, 
      era: 'Imperial', 
      founded: '112 CE', 
      description: 'Imperial Roman library complex with Greek and Latin sections', 
      scrolls: 300000,
      x: 380,
      y: 280,
      scholars: ['Tacitus', 'Suetonius', 'Pliny the Younger', 'Juvenal'],
      collections: ['Imperial archives', 'Legal documents', 'Poetry collections', 'Historiographical works'],
      fate: 'Survived until Byzantine period',
      manuscripts: [
        { title: 'Annals', author: 'Tacitus', variants: 35, apparatus: 'Historical narrative with sources' },
        { title: 'Satires', author: 'Juvenal', variants: 22, apparatus: 'Satirical poetry with scholia' }
      ],
      catalogSystem: 'Bibliotheca Graeca et Latina division',
      preservation: 'Stone niches with bronze nameplates',
      importance: 9
    },
    { 
      id: 4, 
      name: 'Library of Hadrian', 
      location: 'Athens', 
      lat: 37.98, 
      lng: 23.73, 
      era: 'Imperial', 
      founded: '132 CE', 
      description: 'Hadrian\'s philhellenic gift to Athens', 
      scrolls: 16800,
      x: 460,
      y: 300,
      scholars: ['Pausanias', 'Herodes Atticus', 'Aelius Aristides'],
      collections: ['Classical Greek literature', 'Philosophical texts', 'Rhetorical works', 'Antiquarian studies'],
      fate: 'Damaged in Herulian invasion 267 CE',
      manuscripts: [
        { title: 'Description of Greece', author: 'Pausanias', variants: 18, apparatus: 'Periegetic literature' },
        { title: 'Sacred Tales', author: 'Aelius Aristides', variants: 14, apparatus: 'Rhetorical prose' }
      ],
      catalogSystem: 'Hadrianic imperial classification',
      preservation: 'Climate-controlled marble chambers',
      importance: 7
    },
    { 
      id: 5, 
      name: 'Library of Celsus', 
      location: 'Ephesus', 
      lat: 37.94, 
      lng: 27.34, 
      era: 'Imperial', 
      founded: '135 CE', 
      description: 'Memorial library for Tiberius Julius Celsus', 
      scrolls: 12000,
      x: 490,
      y: 290,
      scholars: ['Xenophon of Ephesus', 'Soranus', 'Rufus of Ephesus'],
      collections: ['Medical texts', 'Rhetorical handbooks', 'Local histories', 'Novel literature'],
      fate: 'Earthquake damage 3rd century CE',
      manuscripts: [
        { title: 'Ephesiaca', author: 'Xenophon of Ephesus', variants: 8, apparatus: 'Romance novel tradition' },
        { title: 'Gynecology', author: 'Soranus', variants: 25, apparatus: 'Medical treatise with diagrams' }
      ],
      catalogSystem: 'Celsian memorial organization',
      preservation: 'Two-story architectural niches',
      importance: 6
    },
    { 
      id: 6, 
      name: 'Palatine Library', 
      location: 'Rome', 
      lat: 41.89, 
      lng: 12.49, 
      era: 'Imperial', 
      founded: '28 BCE', 
      description: 'Augustus\'s private library adjacent to Temple of Apollo', 
      scrolls: 50000,
      x: 375,
      y: 285,
      scholars: ['Ovid', 'Horace', 'Propertius', 'Hyginus'],
      collections: ['Augustan poetry', 'Sibylline books', 'Imperial correspondence', 'Mythographical works'],
      fate: 'Fire damage under Domitian',
      manuscripts: [
        { title: 'Metamorphoses', author: 'Ovid', variants: 33, apparatus: 'Epic poetry with commentary' },
        { title: 'Odes', author: 'Horace', variants: 19, apparatus: 'Lyric poetry with metrical analysis' }
      ],
      catalogSystem: 'Augustan court library system',
      preservation: 'Temple precinct with divine protection',
      importance: 8
    },
    { 
      id: 7, 
      name: 'Library of Constantinople', 
      location: 'Constantinople', 
      lat: 41.01, 
      lng: 28.98, 
      era: 'Byzantine', 
      founded: '357 CE', 
      description: 'Imperial Byzantine library preserving classical texts', 
      scrolls: 120000,
      x: 500,
      y: 270,
      scholars: ['Photius', 'Constantine VII', 'Michael Psellus'],
      collections: ['Greek patristics', 'Classical literature', 'Legal codices', 'Theological treatises'],
      fate: 'Survived until 1453 CE',
      manuscripts: [
        { title: 'Bibliotheca', author: 'Photius', variants: 22, apparatus: 'Literary criticism and summaries' },
        { title: 'Chronographia', author: 'Michael Psellus', variants: 16, apparatus: 'Historical narrative' }
      ],
      catalogSystem: 'Byzantine imperial library classification',
      preservation: 'Parchment codices with illuminations',
      importance: 9
    }
  ];

  const eraColors = {
    'Archaic': '#D97706',
    'Classical': '#F59E0B',
    'Hellenistic': '#3B82F6',
    'Imperial': '#DC2626',
    'Late Antique': '#7C3AED',
    'Byzantine': '#059669'
  };

  const filteredLibraries = libraries.filter(lib => {
    const matchesEra = eraFilter === 'all' || lib.era === eraFilter;
    const matchesSearch = lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lib.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lib.scholars.some(scholar => scholar.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesEra && matchesSearch;
  });

  const generateParticles = () => {
    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.5 + 0.1,
        phase: Math.random() * Math.PI * 2
      });
    }
    return particles;
  };

  const particles = generateParticles();

  const renderConnectionLines = () => {
    if (!selectedLibrary) return null;
    
    return libraries
      .filter(lib => lib.id !== selectedLibrary.id)
      .map(lib => (
        <line
          key={`connection-${lib.id}`}
          x1={selectedLibrary.x}
          y1={selectedLibrary.y}
          x2={lib.x}
          y2={lib.y}
          stroke="#C9A227"
          strokeWidth="1"
          opacity="0.3"
          style={{
            filter: 'drop-shadow(0px 0px 4px #C9A227)',
            animation: `pulse 2s infinite alternate`
          }}
        />
      ));
  };

  const render3DLibraryMarker = (library, index) => {
    const isSelected = selectedLibrary?.id === library.id;
    const isHovered = hoveredLibrary?.id === library.id;
    const size = 8 + (library.importance * 2);
    const glowIntensity = isSelected ? 20 : isHovered ? 15 : 8;
    const pulsePhase = (animationPhase + index * 60) % 360;
    
    return (
      <g key={library.id} style={{ cursor: 'pointer' }}>
        {/* Outer glow ring */}
        <circle
          cx={library.x}
          cy={library.y}
          r={size + Math.sin(pulsePhase * Math.PI / 180) * 5}
          fill="none"
          stroke={eraColors[library.era]}
          strokeWidth="2"
          opacity="0.4"
          style={{
            filter: `drop-shadow(0px 0px ${glowIntensity}px ${eraColors[library.era]})`
          }}
        />
        
        {/* Middle energy ring */}
        <circle
          cx={library.x}
          cy={library.y}
          r={size + 3}
          fill="none"
          stroke="#C9A227"
          strokeWidth="1"
          opacity={0.6 + Math.sin(pulsePhase * Math.PI / 180) * 0.3}
          style={{
            filter: 'drop-shadow(0px 0px 8px #C9A227)',
            transform: `rotate(${animationPhase}deg)`,
            transformOrigin: `${library.x}px ${library.y}px`
          }}
        />
        
        {/* Main library marker */}
        <circle
          cx={library.x}
          cy={library.y}
          r={size}
          fill={`url(#gradient-${library.id})`}
          stroke={isSelected ? '#F5F4F2' : eraColors[library.era]}
          strokeWidth={isSelected ? 3 : 2}
          style={{
            filter: `drop-shadow(0px 4px 12px rgba(0,0,0,0.8)) drop-shadow(0px 0px ${glowIntensity}px ${eraColors[library.era]})`,
            transform: isHovered ? 'scale(1.2)' : 'scale(1)',
            transformOrigin: `${library.x}px ${library.y}px`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onClick={() => setSelectedLibrary(library)}
          onMouseEnter={() => setHoveredLibrary(library)}
          onMouseLeave={() => setHoveredLibrary(null)}
        />
        
        {/* Inner highlight */}
        <circle
          cx={library.x - 2}
          cy={library.y - 2}
          r={size * 0.4}
          fill="rgba(245, 244, 242, 0.6)"
          style={{
            filter: 'blur(1px)'
          }}
        />
        
        {/* Scroll count indicator */}
        <text
          x={library.x}
          y={library.y + size + 15}
          fill="#F5F4F2"
          fontSize="10"
          textAnchor="middle"
          style={{
            fontWeight: 'bold',
            textShadow: '0px 0px 4px rgba(0,0,0,0.8)',
            opacity: isHovered || isSelected ? 1 : 0.7
          }}
        >
          {(library.scrolls / 1000).toFixed(0)}k
        </text>
        
        {/* Library name */}
        {(isHovered || isSelected) && (
          <text
            x={library.x}
            y={library.y - size - 10}
            fill="#F5F4F2"
            fontSize="12"
            textAnchor="middle"
            style={{
              fontWeight: 'bold',
              textShadow: '0px 0px 6px rgba(0,0,0,0.9)',
              filter: 'drop-shadow(0px 0px 4px #C9A227)'
            }}
          >
            {library.name}
          </text>
        )}
        
        {/* Era indicator */}
        <rect
          x={library.x + size - 8}
          y={library.y - size + 2}
          width="12"
          height="8"
          fill={eraColors[library.era]}
          rx="2"
          style={{
            filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.6))'
          }}
        />
        
        {/* Gradient definitions */}
        <defs>
          <radialGradient id={`gradient-${library.id}`} cx="0.3" cy="0.3">
            <stop offset="0%" stopColor={eraColors[library.era]} stopOpacity="0.9" />
            <stop offset="70%" stopColor={eraColors[library.era]} stopOpacity="0.7" />
            <stop offset="100%" stopColor="#141419" stopOpacity="0.9" />
          </radialGradient>
        </defs>
      </g>
    );
  };

  const renderParticles = () => {
    return particles.map((particle, index) => (
      <circle
        key={`particle-${index}`}
        cx={particle.x + Math.sin((particleAnimation + particle.phase) * 0.1) * 20}
        cy={particle.y + Math.cos((particleAnimation + particle.phase) * 0.1) * 20}
        r={particle.size}
        fill="#C9A227"
        opacity={particle.opacity * (0.3 + Math.sin(particleAnimation * 0.05 + particle.phase) * 0.3)}
        style={{
          filter: 'blur(1px) drop-shadow(0px 0px 2px #C9A227)'
        }}
      />
    ));
  };

  return (
    <div style={{ 
      backgroundColor: '#0D0D0F', 
      minHeight: '100vh', 
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background gradient */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at ${50 + Math.sin(animationPhase * 0.01) * 20}% ${50 + Math.cos(animationPhase * 0.01) * 20}%, rgba(201, 162, 39, 0.1) 0%, rgba(13, 13, 15, 0.9) 50%)`,
        zIndex: -2
      }} />
      
      {/* Header */}
      <div style={{ 
        backgroundColor: 'rgba(30, 30, 36, 0.9)', 
        padding: '20px',
        borderBottom: '2px solid #C9A227',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              margin: 0, 
              background: 'linear-gradient(135deg, #C9A227, #F5F4F2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(201, 162, 39, 0.5)',
              fontWeight: '800'
            }}>
              Ancient Libraries Map
            </h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '1.1rem', color: '#9CA3AF' }}>
              Interactive visualization of classical manuscript repositories
            </p>
          </div>
          
          <Link href="/" style={{
            color: '#C9A227',
            textDecoration: 'none',
            padding: '12px 24px',
            border: '2px solid #C9A227',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            fontWeight: 'bold',
            background: 'rgba(201, 162, 39, 0.1)',
            backdropFilter: 'blur(5px)',
            boxShadow: '0 4px 15px rgba(201, 162, 39, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#C9A227';
            e.target.style.color = '#0D0D0F';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(201, 162, 39, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(201, 162, 39, 0.1)';
            e.target.style.color = '#C9A227';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(201, 162, 39, 0.2)';
          }}>
            ← Return to Dashboard
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div style={{ 
        padding: '20px',
        background: 'rgba(20, 20, 25, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(201, 162, 39, 0.3)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ color: '#9CA3AF', fontWeight: 'bold' }}>Era Filter:</label>
            <select 
              value={eraFilter} 
              onChange={(e) => setEraFilter(e.target.value)}
              style={{
                backgroundColor: '#1E1E24',
                color: '#F5F4F2',
                border: '2px solid #C9A227',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Eras</option>
              {Object.keys(eraColors).map(era => (
                <option key={era} value={era}>{era}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ color: '#9CA3AF', fontWeight: 'bold' }}>Search:</label>
            <input
              type="text"
              placeholder="Library, location, or scholar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: '#1E1E24',
                color: '#F5F4F2',
                border: '2px solid #C9A227',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '14px',
                outline: 'none',
                minWidth: '250px'
              }}
            />
          </div>
          
          <button
            onClick={() => setShowManuscripts(!showManuscripts)}
            style={{
              backgroundColor: showManuscripts ? '#C9A227' : 'transparent',
              color: showManuscripts ? '#0D0D0F' : '#C9A227',
              border: '2px solid #C9A227',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            {showManuscripts ? 'Hide' : 'Show'} Manuscripts
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Map Container */}
        <div style={{ flex: 1, position: 'relative' }}>
          <svg
            width="800"
            height="600"
            style={{
              backgroundColor: 'rgba(20, 20, 25, 0.5)',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              borderRadius: '12px',
              margin: '20px',
              backdropFilter: 'blur(5px)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
            }}
          >
            {/* Background Mediterranean */}
            <rect
              width="800"
              height="600"
              fill="url(#mapGradient)"
            />
            
            {/* Animated particles */}
            {renderParticles()}
            
            {/* Connection lines */}
            {renderConnectionLines()}
            
            {/* Libraries */}
            {filteredLibraries.map((library, index) => render3DLibraryMarker(library, index))}
            
            {/* Gradient definitions */}
            <defs>
              <radialGradient id="mapGradient" cx="0.5" cy="0.5">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
                <stop offset="50%" stopColor="rgba(13, 13, 15, 0.3)" />
                <stop offset="100%" stopColor="rgba(13, 13, 15, 0.8)" />
              </radialGradient>
            </defs>
          </svg>
          
          {/* Era Legend */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '30px',
            background: 'rgba(30, 30, 36, 0.9)',
            padding: '15px',
            borderRadius: '10px',
            border: '1px solid rgba(201, 162, 39, 0.4)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#C9A227', fontSize: '14px' }}>Historical Periods</h4>
            {Object.entries(eraColors).map(([era, color]) => (
              <div key={era} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '5px 0' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: color, 
                  borderRadius: '50%',
                  boxShadow: `0 0 8px ${color}`
                }} />
                <span style={{ fontSize: '12px', color: '#F5F4F2' }}>{era}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        {selectedLibrary && (
          <div style={{
            width: '400px',
            backgroundColor: 'rgba(30, 30, 36, 0.95)',
            padding: '20px',
            margin: '20px 20px 20px 0',
            borderRadius: '12px',
            border: '2px solid #C9A227',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            maxHeight: '560px',
            overflowY: 'auto',
            transform: isLoaded ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                margin: 0, 
                color: '#C9A227',
                textShadow: '0 0 10px rgba(201, 162, 39, 0.5)'
              }}>
                {selectedLibrary.name}
              </h2>
              <button
                onClick={() => setSelectedLibrary(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{
                  backgroundColor: eraColors[selectedLibrary.era],
                  color: '#F5F4F2',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  boxShadow: `0 0 10px ${eraColors[selectedLibrary.era]}`
                }}>
                  {selectedLibrary.era}
                </span>
                <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Founded {selectedLibrary.founded}</span>
              </div>
              <p style={{ color: '#9CA3AF', margin: '8px 0', fontSize: '14px' }}>📍 {selectedLibrary.location}</p>
              <p style={{ color: '#F5F4F2', margin: '8px 0', lineHeight: '1.5' }}>{selectedLibrary.description}</p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '15px', 
              marginBottom: '20px' 
            }}>
              <div style