'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

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
  const containerRef = useRef(null);

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
      importance: 10,
      language: 'Greek'
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
      importance: 8,
      language: 'Greek'
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
      importance: 9,
      language: 'Both'
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
      importance: 7,
      language: 'Greek'
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
      importance: 6,
      language: 'Greek'
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
      scholars: ['Varro', 'Verrius Flaccus', 'Pompeius Trogus'],
      collections: ['Roman oratory', 'Epic poetry', 'Historical chronicles', 'Grammatical studies'],
      fate: 'Destroyed in Great Fire of Rome 64 CE',
      manuscripts: [
        { title: 'Aeneid', author: 'Virgil', variants: 40, apparatus: 'Augustan recension' },
        { title: 'Ab Urbe Condita', author: 'Livy', variants: 30, apparatus: 'Annalistic history' }
      ],
      catalogSystem: 'Augustan imperial registry',
      preservation: 'Marble shelving with scroll labels',
      importance: 9,
      language: 'Latin'
    },
    {
      id: 7,
      name: 'Imperial Library of Constantinople',
      location: 'Constantinople',
      lat: 41.01,
      lng: 28.96,
      era: 'Byzantine',
      founded: '357 CE',
      description: 'Extensive collection of Greek and Latin texts in the Byzantine capital',
      scrolls: 120000,
      x: 500,
      y: 270,
      scholars: ['John Tzetzes', 'Michael Psellos', 'Photios I'],
      collections: ['Patristic theology', 'Byzantine law', 'Hagiographies', 'Classical commentaries'],
      fate: 'Destroyed during Fourth Crusade 1204 CE',
      manuscripts: [
        { title: 'Corpus Juris Civilis', author: 'Justinian I', variants: 50, apparatus: 'Legal code with glosses' },
        { title: 'Bibliotheca', author: 'Photios I', variants: 28, apparatus: 'Literary reviews' }
      ],
      catalogSystem: 'Byzantine imperial archive',
      preservation: 'Vaulted stone chambers',
      importance: 10,
      language: 'Both'
    },
    {
      id: 8,
      name: 'Caesarea Library',
      location: 'Caesarea Maritima',
      lat: 32.5,
      lng: 34.9,
      era: 'Late Antique',
      founded: '3rd century CE',
      description: 'Early Christian library with theological and biblical texts',
      scrolls: 30000,
      x: 510,
      y: 350,
      scholars: ['Origen', 'Eusebius of Caesarea', 'Pamphilus of Caesarea'],
      collections: ['Biblical exegesis', 'Apologetic literature', 'Church history', 'Theological treatises'],
      fate: 'Destroyed during Muslim conquest 7th century CE',
      manuscripts: [
        { title: 'Hexapla', author: 'Origen', variants: 60, apparatus: 'Critical edition of Hebrew Bible' },
        { title: 'Ecclesiastical History', author: 'Eusebius', variants: 35, apparatus: 'Church historiography' }
      ],
      catalogSystem: 'Early Christian organization',
      preservation: 'Scroll racks',
      importance: 8,
      language: 'Greek'
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

  const filteredLibraries = libraries.filter(library => {
    const eraMatch = eraFilter === 'all' || library.era === eraFilter;
    const searchMatch = library.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      library.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      library.description.toLowerCase().includes(searchTerm.toLowerCase());
    return eraMatch && searchMatch;
  });

  const getLanguageIndicator = (language) => {
    if (language === 'Greek') {
      return <span style={{ color: '#3B82F6', fontWeight: 'bold', fontSize: '0.8em' }}>Α</span>;
    } else if (language === 'Latin') {
      return <span style={{ color: '#DC2626', fontWeight: 'bold', fontSize: '0.8em' }}>L</span>;
    } else if (language === 'Both') {
      return <><span style={{ color: '#3B82F6', fontWeight: 'bold', fontSize: '0.8em' }}>Α</span><span style={{ color: '#DC2626', fontWeight: 'bold', fontSize: '0.8em' }}>L</span></>;
    }
    return null;
  };

  const getColorForImportance = (importance) => {
    const baseColor = '#C9A227'; // Gold
    const opacity = importance / 10;
    return `rgba(201, 162, 39, ${opacity})`; // Adjust opacity based on importance
  };

  const MapView = () => (
    <div style={{ position: 'relative', width: '100%', height: '600px', overflow: 'hidden' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 500">
        <defs>
          <pattern id="water" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M0,2 L6,2 L6,3 L0,3 Z" fill="none" stroke="#1E1E24" strokeWidth="1" />
            <path d="M2,0 L2,6 L3,6 L3,0 Z" fill="none" stroke="#1E1E24" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#water)" />

        {filteredLibraries.map(library => (
          <circle
            key={library.id}
            cx={library.x}
            cy={library.y}
            r={library.importance * 2}
            fill={getColorForImportance(library.importance)}
            stroke={hoveredLibrary?.id === library.id ? '#F5F4F2' : 'none'}
            strokeWidth={2}
            style={{
              cursor: 'pointer',
              transition: 'fill 0.3s, stroke 0.3s',
              opacity: isLoaded ? 1 : 0,
            }}
            onMouseEnter={() => setHoveredLibrary(library)}
            onMouseLeave={() => setHoveredLibrary(null)}
            onClick={() => setSelectedLibrary(library)}
          />
        ))}
      </svg>
    </div>
  );

  const ListView = () => (
    <div style={{ width: '100%' }}>
      {filteredLibraries.map(library => (
        <div
          key={library.id}
          style={{
            backgroundColor: '#1E1E24',
            color: '#F5F4F2',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            border: hoveredLibrary?.id === library.id ? `2px solid #C9A227` : 'none',
          }}
          onMouseEnter={() => setHoveredLibrary(library)}
          onMouseLeave={() => setHoveredLibrary(null)}
          onClick={() => setSelectedLibrary(library)}
        >
          <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2em' }}>
            {library.name} {getLanguageIndicator(library.language)}
          </h3>
          <p style={{ margin: '0', color: '#9CA3AF' }}>{library.location}</p>
        </div>
      ))}
    </div>
  );


  return (
    <div style={{
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2',
      fontFamily: 'sans-serif',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>

        <h1 style={{
          fontSize: '2.5em',
          fontWeight: 'bold',
          marginBottom: '20px',
          textAlign: 'center',
          color: '#C9A227',
          letterSpacing: '1px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          Ancient Libraries of the World
        </h1>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={{
                backgroundColor: viewMode === 'map' ? '#1E1E24' : '#141419',
                color: '#F5F4F2',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                fontWeight: viewMode === 'map' ? 'bold' : 'normal'
              }}
              onClick={() => setViewMode('map')}
            >
              Map View
            </button>
            <button
              style={{
                backgroundColor: viewMode === 'list' ? '#1E1E24' : '#141419',
                color: '#F5F4F2',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                fontWeight: viewMode === 'list' ? 'bold' : 'normal'
              }}
              onClick={() => setViewMode('list')}
            >
              List View
            </button>
          </div>

          <input
            type="text"
            placeholder="Search libraries..."
            style={{
              backgroundColor: '#141419',
              color: '#F5F4F2',
              padding: '10px',
              border: 'none',
              borderRadius: '5px',
              width: '300px'
            }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <select
            style={{
              backgroundColor: '#141419',
              color: '#F5F4F2',
              padding: '10px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            value={eraFilter}
            onChange={e => setEraFilter(e.target.value)}
          >
            <option value="all">All Eras</option>
            <option value="Archaic">Archaic</option>
            <option value="Classical">Classical</option>
            <option value="Hellenistic">Hellenistic</option>
            <option value="Imperial">Imperial</option>
            <option value="Late Antique">Late Antique</option>
            <option value="Byzantine">Byzantine</option>
          </select>
        </div>

        <div ref={containerRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {viewMode === 'map' ? <MapView /> : <ListView />}
        </div>

        {selectedLibrary && (
          <div style={{
            backgroundColor: '#1E1E24',
            color: '#F5F4F2',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }}>
            <button style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#9CA3AF',
              cursor: 'pointer',
              fontSize: '1.2em'
            }} onClick={() => setSelectedLibrary(null)}>
              X
            </button>
            <h2 style={{ fontSize: '1.8em', fontWeight: 'bold', marginBottom: '10px' }}>{selectedLibrary.name} {getLanguageIndicator(selectedLibrary.language)}</h2>
            <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>Location: {selectedLibrary.location}</p>
            <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>Era: {selectedLibrary.era}</p>
            <p style={{ marginBottom: '10px', lineHeight: '1.6' }}>{selectedLibrary.description}</p>
            <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>Founded: {selectedLibrary.founded}</p>
            <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>Estimated Scrolls: {selectedLibrary.scrolls ? selectedLibrary.scrolls.toLocaleString() : 'Unknown'}</p>
            <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>Catalog System: {selectedLibrary.catalogSystem}</p>
            <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>Preservation: {selectedLibrary.preservation}</p>
            <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>Fate: {selectedLibrary.fate}</p>

            {selectedLibrary.scholars && selectedLibrary.scholars.length > 0 && (
              <>
                <h3 style={{ fontSize: '1.2em', marginTop: '15px', marginBottom: '5px' }}>Scholars:</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {selectedLibrary.scholars.map((scholar, index) => (
                    <li key={index} style={{ color: '#9CA3AF', marginBottom: '3px' }}>{scholar}</li>
                  ))}
                </ul>
              </>
            )}

            {selectedLibrary.collections && selectedLibrary.collections.length > 0 && (
              <>
                <h3 style={{ fontSize: '1.2em', marginTop: '15px', marginBottom: '5px' }}>Collections:</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {selectedLibrary.collections.map((collection, index) => (
                    <li key={index} style={{ color: '#9CA3AF', marginBottom: '3px' }}>{collection}</li>
                  ))}
                </ul>
              </>
            )}

            <button
              style={{
                backgroundColor: showManuscripts ? '#DC2626' : '#059669',
                color: '#F5F4F2',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '20px',
                transition: 'background-color 0.3s'
              }}
              onClick={() => setShowManuscripts(!showManuscripts)}
            >
              {showManuscripts ? 'Hide Manuscripts' : 'Show Manuscripts'}
            </button>

            {showManuscripts && selectedLibrary.manuscripts && selectedLibrary.manuscripts.length > 0 && (
              <>
                <h3 style={{ fontSize: '1.2em', marginTop: '15px', marginBottom: '5px' }}>Notable Manuscripts:</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {selectedLibrary.manuscripts.map((manuscript, index) => (
                    <li key={index} style={{ color: '#9CA3AF', marginBottom: '3px' }}>
                      <strong style={{ color: '#F5F4F2' }}>{manuscript.title}</strong> by {manuscript.author}
                      {manuscript.variants && <>- {manuscript.variants} variants</>}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}