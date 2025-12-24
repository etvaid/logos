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
      founded: '356 CE', 
      description: 'Extensive collection of Greek and Latin literature in the heart of Byzantium', 
      scrolls: 120000,
      x: 500,
      y: 280,
      scholars: ['John Tzetzes', 'Michael Psellos', 'Photius', 'Arethas of Caesarea'],
      collections: ['Patristic theology', 'Byzantine chronicles', 'Classical commentaries', 'Illuminated manuscripts'],
      fate: 'Destroyed in Fourth Crusade 1204 CE',
      manuscripts: [
        { title: 'Theogony', author: 'Hesiod', variants: 27, apparatus: 'Scholia with allegorical interpretations' },
        { title: 'Iliad', author: 'Homer', variants: 51, apparatus: 'Venetus A manuscript' }
      ],
      catalogSystem: 'Thematic classification',
      preservation: 'Vaulted chambers with iconographic decorations'
    },
    { 
      id: 8, 
      name: 'Nalanda University Library', 
      location: 'Bihar, India', 
      lat: 25.14, 
      lng: 85.45, 
      era: 'Late Antique', 
      founded: '5th century CE', 
      description: 'Vast Buddhist monastic library with texts in Sanskrit, Pali, and Tibetan', 
      scrolls: 9000000,
      x: 750,
      y: 400,
      scholars: ['Dharmapala', 'Silabhadra', 'Xuanzang', 'Atisha'],
      collections: ['Mahayana sutras', 'Tantric texts', 'Logic and epistemology', 'Medical treatises', 'Linguistic studies'],
      fate: 'Sacked by Bakhtiyar Khilji 1193 CE',
      manuscripts: [
        { title: 'Prajnaparamita Sutra', author: 'Nagarjuna', variants: 45, apparatus: 'Abhisamayalankara commentary' },
        { title: 'Vinaya Pitaka', author: 'Buddha', variants: 31, apparatus: 'Sarvastivadin recension' }
      ],
      catalogSystem: 'Subject-based organization',
      preservation: 'Nine-story Ratnasagara building'
    },
    { 
      id: 9, 
      name: 'Caesarea Maritima Library', 
      location: 'Caesarea, Palestine', 
      lat: 32.5, 
      lng: 34.9, 
      era: 'Late Antique', 
      founded: '3rd Century CE', 
      description: 'Early Christian library, served as an important theological center', 
      scrolls: 30000,
      x: 530,
      y: 350,
      scholars: ['Origen', 'Eusebius', 'Pamphilus'],
      collections: ['Biblical manuscripts', 'Theological treatises', 'Apologetic literature', 'Hagiographies'],
      fate: 'Destroyed during the Muslim conquest of Palestine in the 7th century',
      manuscripts: [
        { title: 'Hexapla', author: 'Origen', variants: 60, apparatus: 'Critical apparatus for the Hebrew Bible' },
        { title: 'Ecclesiastical History', author: 'Eusebius', variants: 29, apparatus: 'Chronological narrative of the early church' }
      ],
      catalogSystem: 'Pamphilus\' classification',
      preservation: 'Amphitheater chambers near the coast'
    },
  ];


  const eraColors = {
    'Archaic': '#D97706',
    'Classical': '#F59E0B',
    'Hellenistic': '#3B82F6',
    'Imperial': '#DC2626',
    'Late Antique': '#7C3AED',
    'Byzantine': '#059669',
  };

  const filteredLibraries = libraries.filter(library => {
    const eraMatch = eraFilter === 'all' || library.era === eraFilter;
    const searchTermMatch = library.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             library.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             library.description.toLowerCase().includes(searchTerm.toLowerCase());

    return eraMatch && searchTermMatch;
  });

  const getEraColor = (era) => eraColors[era] || '#6B7280';

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', transition: 'background-color 0.3s ease' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#C9A227' }}>Ancient Libraries Explorer</h1>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search libraries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #6B7280',
            backgroundColor: '#1E1E24',
            color: '#F5F4F2',
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
          }}
        />

        <select
          value={eraFilter}
          onChange={(e) => setEraFilter(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #6B7280',
            backgroundColor: '#1E1E24',
            color: '#F5F4F2',
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
          }}
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

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <button
          onClick={() => setViewMode('map')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: viewMode === 'map' ? '#C9A227' : '#1E1E24',
            color: '#F5F4F2',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            fontWeight: viewMode === 'map' ? 'bold' : 'normal',
          }}
        >
          Map View
        </button>
        <button
          onClick={() => setViewMode('list')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: viewMode === 'list' ? '#C9A227' : '#1E1E24',
            color: '#F5F4F2',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            fontWeight: viewMode === 'list' ? 'bold' : 'normal',
          }}
        >
          List View
        </button>
      </div>

      {viewMode === 'map' && (
        <div style={{ position: 'relative', width: '800px', height: '500px', backgroundColor: '#1E1E24', borderRadius: '10px', overflow: 'hidden' }}>
          <svg width="800" height="500" style={{ position: 'absolute', top: 0, left: 0 }}>
            <image href="/world-map.svg" width="800" height="500" />
            {filteredLibraries.map(library => (
              <circle
                key={library.id}
                cx={library.x}
                cy={library.y}
                r={6}
                fill={getEraColor(library.era)}
                opacity={hoveredLibrary?.id === library.id || selectedLibrary?.id === library.id ? 1 : 0.7}
                style={{ cursor: 'pointer', transition: 'opacity 0.2s ease' }}
                onMouseEnter={() => setHoveredLibrary(library)}
                onMouseLeave={() => setHoveredLibrary(null)}
                onClick={() => setSelectedLibrary(library)}
                title={library.name}
              />
            ))}
          </svg>
        </div>
      )}

      {viewMode === 'list' && (
        <div style={{ width: '80%', maxWidth: '800px' }}>
          {filteredLibraries.map(library => (
            <div
              key={library.id}
              style={{
                backgroundColor: '#1E1E24',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                border: hoveredLibrary?.id === library.id ? '2px solid #C9A227' : 'none',
                transition: 'background-color 0.3s ease, border 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredLibrary(library)}
              onMouseLeave={() => setHoveredLibrary(null)}
              onClick={() => setSelectedLibrary(library)}
            >
              <h3 style={{ color: '#F5F4F2', marginBottom: '5px' }}>{library.name}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>{library.location} ({library.era})</p>
            </div>
          ))}
        </div>
      )}

      {selectedLibrary && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#141419',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 1000,
          width: '80%',
          maxWidth: '600px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
        }}>
          <button
            onClick={() => setSelectedLibrary(null)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#9CA3AF',
              cursor: 'pointer',
              fontSize: '1.2rem',
            }}
          >
            X
          </button>
          <h2 style={{ color: '#C9A227', marginBottom: '10px' }}>{selectedLibrary.name}</h2>
          <p style={{ color: '#F5F4F2', marginBottom: '5px' }}><strong>Location:</strong> {selectedLibrary.location}</p>
          <p style={{ color: '#F5F4F2', marginBottom: '5px' }}><strong>Era:</strong> {selectedLibrary.era}</p>
          <p style={{ color: '#F5F4F2', marginBottom: '5px' }}><strong>Founded:</strong> {selectedLibrary.founded}</p>
          <p style={{ color: '#F5F4F2', marginBottom: '10px' }}>{selectedLibrary.description}</p>
          <p style={{ color: '#F5F4F2', marginBottom: '5px' }}><strong>Scrolls:</strong> {selectedLibrary.scrolls}</p>
          {selectedLibrary.scholars && selectedLibrary.scholars.length > 0 && (
            <>
              <p style={{ color: '#F5F4F2', marginBottom: '5px' }}><strong>Scholars:</strong></p>
              <ul style={{ color: '#F5F4F2', marginBottom: '10px', listStyleType: 'disc', paddingLeft: '20px' }}>
                {selectedLibrary.scholars.map((scholar, index) => (
                  <li key={index}>{scholar}</li>
                ))}
              </ul>
            </>
          )}
          {selectedLibrary.collections && selectedLibrary.collections.length > 0 && (
            <>
              <p style={{ color: '#F5F4F2', marginBottom: '5px' }}><strong>Collections:</strong></p>
              <ul style={{ color: '#F5F4F2', marginBottom: '10px', listStyleType: 'disc', paddingLeft: '20px' }}>
                {selectedLibrary.collections.map((collection, index) => (
                  <li key={index}>{collection}</li>
                ))}
              </ul>
            </>
          )}
          <p style={{ color: '#F5F4F2', marginBottom: '10px' }}><strong>Fate:</strong> {selectedLibrary.fate}</p>
        </div>
      )}
    </div>
  );
}