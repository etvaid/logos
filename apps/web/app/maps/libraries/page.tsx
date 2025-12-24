'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LibrariesMap() {
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [hoveredLibrary, setHoveredLibrary] = useState(null);
  const [viewMode, setViewMode] = useState('map');
  const [eraFilter, setEraFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
      preservation: 'Papyrus scrolls in cedar boxes'
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
      preservation: 'Parchment codices (pergamene invention)'
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
      scrolls: 700000,
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
      preservation: 'Stone niches with bronze nameplates'
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
      preservation: 'Climate-controlled marble chambers'
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
      preservation: 'Two-story architectural niches'
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
      preservation: 'Temple precinct with divine protection'
    },
    { 
      id: 7, 
      name: 'Imperial Library', 
      location: 'Constantinople', 
      lat: 41.01, 
      lng: 28.98, 
      era: 'Byzantine', 
      founded: '357 CE', 
      description: 'Byzantine imperial collection preserving classical texts', 
      scrolls: 120000,
      x: 500,
      y: 250,
      scholars: ['Photius', 'Constantine VII', 'John Tzetzes', 'Michael Psellus'],
      collections: ['Classical manuscripts', 'Patristic literature', 'Byzantine chronicles', 'Lexicographical works'],
      fate: 'Survived until 1453 CE',
      manuscripts: [
        { title: 'Bibliotheca', author: 'Photius', variants: 45, apparatus: 'Epitomizing collection' },
        { title: 'Chiliades', author: 'John Tzetzes', variants: 31, apparatus: 'Learned poetry with scholia' }
      ],
      catalogSystem: 'Byzantine imperial catalog system',
      preservation: 'Parchment codices with illuminations'
    },
    { 
      id: 8, 
      name: 'Library of Caesarea', 
      location: 'Caesarea Maritima', 
      lat: 32.5, 
      lng: 34.9, 
      era: 'Late Antique', 
      founded: '230 CE', 
      description: 'Origen\'s scholarly library, center of Christian learning', 
      scrolls: 30000,
      x: 510,
      y: 320,
      scholars: ['Origen', 'Pamphilus', 'Eusebius', 'Jerome'],
      collections: ['Biblical manuscripts', 'Patristic texts', 'Apologetic literature', 'Hexapla materials'],
      fate: 'Destroyed by Arab conquest 638 CE',
      manuscripts: [
        { title: 'Hexapla', author: 'Origen', variants: 52, apparatus: 'Six-column biblical text' },
        { title: 'Ecclesiastical History', author: 'Eusebius', variants: 29, apparatus: 'Church historical sources' }
      ],
      catalogSystem: 'Christian scholarly organization',
      preservation: 'Scriptural codices with commentary'
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

  const MapView = () => (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '600px', 
      backgroundColor: '#1E1E24', 
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #374151'
    }}>
      <svg width="100%" height="100%" viewBox="0 0 800 600" style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Mediterranean coastlines */}
        <path d="M100 200 Q200 180 300 200 Q400 190 500 210 Q600 200 700 220" 
              stroke="#6B7280" strokeWidth="1" fill="none" opacity="0.3"/>
        <path d="M150 350 Q250 340 350 360 Q450 350 550 370" 
              stroke="#6B7280" strokeWidth="1" fill="none" opacity="0.3"/>
        
        {/* Region labels */}
        <text x="200" y="150" fill="#9CA3AF" fontSize="14" fontWeight="500">Asia Minor</text>
        <text x="350" y="200" fill="#9CA3AF" fontSize="14" fontWeight="500">Greece</text>
        <text x="250" y="250" fill="#9CA3AF" fontSize="14" fontWeight="500">Italy</text>
        <text x="500" y="400" fill="#9CA3AF" fontSize="14" fontWeight="500">Egypt</text>
        
        {/* Library markers */}
        {filteredLibraries.map(library => (
          <g key={library.id}>
            <circle
              cx={library.x}
              cy={library.y}
              r={hoveredLibrary === library.id ? 8 : 6}
              fill={eraColors[library.era]}
              stroke="#F5F4F2"
              strokeWidth="2"
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                filter: selectedLibrary === library.id ? 'drop-shadow(0 0 10px currentColor)' : 'none'
              }}
              onMouseEnter={() => setHoveredLibrary(library.id)}
              onMouseLeave={() => setHoveredLibrary(null)}
              onClick={() => setSelectedLibrary(library)}
            />
            {(hoveredLibrary === library.id || selectedLibrary?.id === library.id) && (
              <text
                x={library.x}
                y={library.y - 15}
                fill="#F5F4F2"
                fontSize="12"
                fontWeight="500"
                textAnchor="middle"
                style={{ pointerEvents: 'none' }}
              >
                {library.name}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );

  const ListView = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
      {filteredLibraries.map(library => (
        <div
          key={library.id}
          style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '24px',
            border: selectedLibrary?.id === library.id ? `2px solid ${eraColors[library.era]}` : '1px solid #374151',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: hoveredLibrary === library.id ? 'translateY(-2px)' : 'translateY(0)'
          }}
          onMouseEnter={() => setHoveredLibrary(library.id)}
          onMouseLeave={() => setHoveredLibrary(null)}
          onClick={() => setSelectedLibrary(library)}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <div 
              style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: eraColors[library.era],
                marginRight: '12px'
              }}
            />
            <h3 style={{ color: '#F5F4F2', fontSize: '18px', fontWeight: '600', margin: 0, flex: 1 }}>
              {library.name}
            </h3>
            <span style={{ color: '#9CA3AF', fontSize: '14px' }}>{library.era}</span>
          </div>
          
          <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '16px', lineHeight: '1.5' }}>
            {library.description}
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <span style={{ color: '#6B7280', fontSize: '12px', display: 'block' }}>Founded</span>
              <span style={{ color: '#F5F4F2', fontSize: '14px', fontWeight: '500' }}>{library.founded}</span>
            </div>
            <div>
              <span style={{ color: '#6B7280', fontSize: '12px', display: 'block' }}>Collection Size</span>
              <span style={{ color: '#F5F4F2', fontSize: '14px', fontWeight: '500' }}>
                {library.scrolls.toLocaleString()} scrolls
              </span>
            </div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <span style={{ color: '#6B7280', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
              Notable Scholars
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {library.scholars.slice(0, 3).map(scholar => (
                <span 
                  key={scholar}
                  style={{ 
                    backgroundColor: '#141419', 
                    color: '#C9A227', 
                    fontSize: '12px', 
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}
                >
                  {scholar}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const LibraryDetails = ({ library }) => (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      width: '500px', 
      height: '100vh', 
      backgroundColor: '#1E1E24',
      borderLeft: '1px solid #374151',
      padding: '24px',
      overflowY: 'auto',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', marginBottom: '24px' }}>
        <h2 style={{ color: '#F5F4F2', fontSize: '24px', fontWeight: '700', margin: 0, flex: 1 }}>
          {library.name}
        </h2>
        <button
          onClick={() => setSelectedLibrary(null)}
          style={{ 
            backgroundColor: 'transparent',
            border: 'none',
            color: '#9CA3AF',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ 
        backgroundColor: eraColors[library.era], 
        color: '#0D0D0F', 
        padding: '8px 16px', 
        borderRadius: '6px', 
        display: 'inline-block',
        fontWeight: '600',
        fontSize: '14px',
        marginBottom: '20px'
      }}>
        {library.era} Period ({library.founded})
      </div>

      <p style={{ color: '#9CA3AF', fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
        {library.description}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h4 style={{ color: '#F5F4F2', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
            Location
          </h4>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: 0 }}>{library.location}</p>
        </div>
        <div>
          <h4 style={{ color: '#F5F4F2', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
            Collection Size
          </h4>
          <p style={{ color: '#C9A227', fontSize: '14px', fontWeight: '600', margin: 0 }}>
            {library.scrolls.toLocaleString()} scrolls
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ color: '#F5F4F2', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          Catalog System
        </h4>
        <p style={{ color: '#9CA3AF', fontSize: '14px', backgroundColor: '#141419', padding: '12px', borderRadius: '8px' }}>
          {library.catalogSystem}
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ color: '#F5F4F2', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          Preservation Methods
        </h4>
        <p style={{ color: '#9CA3AF', fontSize: '14px', backgroundColor: '#141419', padding: '12px', borderRadius: '8px' }}>
          {library.preservation}
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ color: '#F5F4F2', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          Associated Scholars
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {library.scholars.map(scholar => (
            <span 
              key={scholar}
              style={{ 
                backgroundColor: '#141419', 
                color: '#C9A227', 
                fontSize: '14px', 
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #374151'
              }}
            >
              {scholar}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ color: '#F5F4F2', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          Major Collections
        </h4>
        <ul style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
          {library.collections.map((collection, index) => (
            <li key={index} style={{ marginBottom: '4px' }}>{collection}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ color: '#F5F4F2', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          Key Manuscripts
        </h4>
        {library.manuscripts.map((ms, index) => (
          <div key={index} style={{ 
            backgroundColor: '#141419', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '12px',
            border: '1px solid #374151'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <h5 style={{ color: '#F5F4F2', fontSize: '14px', fontWeight: '600', margin: 0, flex: 1 }}>
                {ms.title}
              </h5>
              <span style={{ color: '#C9A227', fontSize: '12px' }}>by {ms.author}</span>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: '12px', margin: '0 0 8px 0' }}>
              {ms.apparatus}
            </p>
            <div style={{ color: '#6B7280', fontSize: '11px' }}>
              Manuscript variants: {ms.variants}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        backgroundColor: '#DC2626', 
        color: '#F5F4F2', 
        padding: '12px', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <strong>Historical Fate:</strong> {library.fate}
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      padding: '24px',
      paddingRight: selectedLibrary ? '524px' : '24px',
      transition: 'padding-right 0.3s ease'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <Link href="/maps" style={{ 
            color: '#C9A227', 
            textDecoration: 'none', 
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center'
          }}>
            ← Maps
          </Link>
        </div>
        <h1 style={{ 
          color: '#F5F4F2', 
          fontSize: '36px', 
          fontWeight: '700', 
          margin: '0 0 12px 0' 
        }}>
          Ancient Libraries & Scholarly Centers
        </h1>
        <p style={{ 
          color: '#9CA3AF', 
          fontSize: '18px', 
          margin: 0, 
          lineHeight: '1.6' 
        }}>
          Mapping the great repositories of classical learning, their manuscript collections, and scholarly apparatus
        </p>
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setViewMode('map')}
            style={{
              backgroundColor: viewMode === 'map' ? '#C9A227' : '#1E1E24',
              color: viewMode === 'map' ? '#0D0D0F' : '#F5F4F2',
              border: '1px solid #374151',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            Map View
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              backgroundColor: viewMode === 'list' ? '#C9A227' : '#1E1E24',
              color: viewMode === 'list' ? '#0D0D0F' : '#F5F4F2',
              border: '1px solid #374151',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            List View
          </button>
        </div>

        <select
          value={eraFilter}
          onChange={(e) => setEraFilter(e.target.value)}
          style={{
            backgroundColor: '#1E1E24',
            color: '#F5F4F2',
            border: '1px solid #374151',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        >
          <option value="all">All Eras</option>
          {Object.keys(eraColors).map(era => (
            <option key={era} value={era}>{era}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search libraries, locations, scholars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            backgroundColor: '#1E1E24',
            color: '#F5F4F2',
            border: '1px solid #374151',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            minWidth: '300px'
          }}
        />
      </div>

      {/* Era Legend */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#1E1E24',
        borderRadius: '12px',
        flexWrap: 'wrap'
      }}>
        {Object.entries(eraColors).map(([era, color]) => (
          <div key={era} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color }} />
            <span style={{ color: '#F5F4F2', fontSize: '14px' }}>{era}</span>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{ 
          backgroundColor: '#1E1E24', 
          padding: '20px', 
          borderRadius: '12px',
          border: '1px solid #374151'
        }}>
          <div style={{ color: '#C9A227', fontSize: '24px', fontWeight: '700' }}>
            {filteredLibraries.length}
          </div>
          <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Major Libraries</div>
        </div>
        <div style={{ 
          backgroundColor: '#1E1E24', 
          padding: '20px', 
          borderRadius: '12px',
          border: '1px solid #374151'
        }}>
          <div style={{ color: '#C9A227', fontSize: '24px', fontWeight: '700' }}>
            {(filteredLibraries.reduce((sum, lib) => sum + lib.scrolls, 0) / 1000000).toFixed(1)}M
          </div>
          <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Total Scrolls</div>
        </div>
        <div style={{ 
          backgroundColor: '#1E1E24', 
          padding: '20px', 
          borderRadius: '12px',
          border: '1px solid #374151'
        }}>
          <div style={{ color: '#C9A227', fontSize: '24px', fontWeight: '700' }}>
            {[...new Set(filteredLibraries.flatMap(lib => lib.scholars))].length}
          </div>
          <div style={{ color: '#9CA