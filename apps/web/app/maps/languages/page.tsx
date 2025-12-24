'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LanguagesMap() {
  const [selectedEra, setSelectedEra] = useState(500);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showCriticalApparatus, setShowCriticalApparatus] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showParadigms, setShowParadigms] = useState(false);
  const [showWordEmbeddings, setShowWordEmbeddings] = useState(false);

  const eras = [
    { year: 800, label: '800 BCE', color: '#D97706', name: 'Archaic' },
    { year: 500, label: '500 BCE', color: '#F59E0B', name: 'Classical' },
    { year: 323, label: '323 BCE', color: '#3B82F6', name: 'Hellenistic' },
    { year: 31, label: '31 BCE', color: '#DC2626', name: 'Imperial' },
    { year: 284, label: '284 CE', color: '#7C3AED', name: 'Late Antique' },
    { year: 600, label: '600 CE', color: '#059669', name: 'Byzantine' }
  ];

  const languageTypes = [
    { name: 'Greek', color: '#3B82F6', symbol: 'Α' },
    { name: 'Latin', color: '#DC2626', symbol: 'L' },
    { name: 'Celtic', color: '#D97706', symbol: 'C' },
    { name: 'Germanic', color: '#10B981', symbol: 'G' },
    { name: 'Persian', color: '#7C3AED', symbol: 'P' },
    { name: 'Egyptian', color: '#F59E0B', symbol: 'E' },
    { name: 'Semitic', color: '#EF4444', symbol: 'S' }
  ];

  const allRegions: { [key: number]: Array<{
    id: string;
    name: string;
    language: string;
    color: string;
    type: string;
    cx: number;
    cy: number;
    size: number;
    influence: string;
    population: string;
    description: string;
    manuscripts: string[];
    variants: string[];
    paradigm: string;
    lsj: string;
    semantic_drift: string;
    polytonic: string;
  }> } = {
    800: [
      { id: 'attica', name: 'Attica', language: 'Attic Greek', color: '#3B82F6', type: 'Greek', cx: 480, cy: 180, size: 15, influence: 'Emerging polis system', population: '~200,000', description: 'Developing distinctive dialect features', manuscripts: ['P.Oxy 1'], variants: ['ἄνθρωπος/ἀνέρ'], paradigm: 'λύω', lsj: 'λύω: to loose, release', semantic_drift: 'λύω: "untie" → "solve" → "destroy"', polytonic: 'λύω, λῡ́εις, λῡ́ει' },
      { id: 'ionia', name: 'Ionia', language: 'Ionic Greek', color: '#3B82F6', type: 'Greek', cx: 520, cy: 160, size: 20, influence: 'Early literary tradition', population: '~300,000', description: 'Homer\'s linguistic homeland', manuscripts: ['Venetus A'], variants: ['ἠώς/αὐγή'], paradigm: 'φιλέω', lsj: 'φιλέω: to love, regard with affection', semantic_drift: 'φιλέω: "kiss" → "love" → "honor"', polytonic: 'φιλέω, φιλεῖς, φιλεῖ' },
      { id: 'sparta', name: 'Laconia', language: 'Doric Greek', color: '#3B82F6', type: 'Greek', cx: 460, cy: 200, size: 18, influence: 'Conservative dialectal forms', population: '~150,000', description: 'Preserving archaic features', manuscripts: ['Alcman fr.'], variants: ['ἁμέρα/ἡμέρα'], paradigm: 'δίδωμι', lsj: 'δίδωμι: to give', semantic_drift: 'δίδωμι: "give" → "grant" → "allow"', polytonic: 'δίδωμι, δίδως, δίδωσι' },
      { id: 'rome', name: 'Latium', language: 'Old Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 12, influence: 'Local Italic dialect', population: '~50,000', description: 'Pre-literary Latin forms', manuscripts: ['CIL I²'], variants: ['duonoro/bonorum'], paradigm: 'amo', lsj: 'N/A (Latin)', semantic_drift: 'amo: "love" → "like" → "prefer"', polytonic: 'N/A' },
      { id: 'gaul', name: 'Gallia', language: 'Gaulish', color: '#D97706', type: 'Celtic', cx: 260, cy: 100, size: 25, influence: 'Celtic substrate', population: '~2,000,000', description: 'Continental Celtic languages', manuscripts: ['Coligny'], variants: ['brigā/castellum'], paradigm: 'N/A', lsj: 'N/A (Celtic)', semantic_drift: 'brigā: "hill" → "fort" → "town"', polytonic: 'N/A' }
    ],
    500: [
      { id: 'athens', name: 'Athens', language: 'Attic Greek', color: '#3B82F6', type: 'Greek', cx: 480, cy: 180, size: 25, influence: 'Literary koinē emerging', population: '~300,000', description: 'Classical prose standard', manuscripts: ['Bodmer VIII'], variants: ['οἶδα/εἰδῶ'], paradigm: 'παιδεύω', lsj: 'παιδεύω: to bring up a child, educate', semantic_drift: 'παιδεύω: "raise child" → "educate" → "correct"', polytonic: 'παιδεύω, παιδεύεις, παιδεύει' },
      { id: 'ionia', name: 'Ionia', language: 'Ionic Greek', color: '#3B82F6', type: 'Greek', cx: 520, cy: 160, size: 20, influence: 'Historical prose', population: '~350,000', description: 'Herodotean historiography', manuscripts: ['Papyrus Florentinus'], variants: ['ἱστορίη/ἱστορία'], paradigm: 'ἱστορέω', lsj: 'ἱστορέω: to inquire, examine', semantic_drift: 'ἱστορέω: "see" → "inquire" → "narrate"', polytonic: 'ἱστορέω, ἱστορέεις, ἱστορέει' },
      { id: 'rome', name: 'Rome', language: 'Classical Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 18, influence: 'Republican expansion', population: '~100,000', description: 'Legal and oratorical register', manuscripts: ['Codex Ambrosianus'], variants: ['honos/honor'], paradigm: 'amo', lsj: 'N/A (Latin)', semantic_drift: 'honos: "honor" → "office" → "glory"', polytonic: 'N/A' }
    ],
    323: [
      { id: 'alexandria', name: 'Alexandria', language: 'Koinē Greek', color: '#3B82F6', type: 'Greek', cx: 540, cy: 250, size: 30, influence: 'Hellenistic scholarship', population: '~400,000', description: 'Scholarly koinē standard', manuscripts: ['P.Hibeh', 'P.Petrie'], variants: ['σύνταξις/τάξις'], paradigm: 'συντάσσω', lsj: 'συντάσσω: to arrange together', semantic_drift: 'συντάσσω: "arrange" → "compose" → "organize"', polytonic: 'συντάσσω, συντάσσεις, συντάσσει' },
      { id: 'antioch', name: 'Antioch', language: 'Koinē Greek', color: '#3B82F6', type: 'Greek', cx: 580, cy: 140, size: 25, influence: 'Administrative koinē', population: '~250,000', description: 'Administrative koinē', manuscripts: ['P.Amherst'], variants: ['λόγος/ῥῆμα'], paradigm: 'βασιλεύω', lsj: 'βασιλεύω: to be king, reign', semantic_drift: 'βασιλεύω: "be king" → "rule" → "govern"', polytonic: 'βασιλεύω, βασιλεύεις, βασιλεύει' },
      { id: 'rome', name: 'Rome', language: 'Classical Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 22, influence: 'Growing cultural power', population: '~200,000', description: 'Ciceronian prose style', manuscripts: ['Codex Mediolanensis'], variants: ['urbs/civitas'], paradigm: 'lego', lsj: 'N/A (Latin)', semantic_drift: 'lego: "read" → "choose" → "collect"', polytonic: 'N/A' }
    ],
    31: [
      { id: 'rome', name: 'Rome', language: 'Classical Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 35, influence: 'Imperial standardization', population: '~1,000,000', description: 'Augustan literary style', manuscripts: ['Vergilius Romanus'], variants: ['imperator/dux'], paradigm: 'impero', lsj: 'N/A (Latin)', semantic_drift: 'impero: "command" → "rule" → "govern"', polytonic: 'N/A' },
      { id: 'alexandria', name: 'Alexandria', language: 'Koinē Greek', color: '#3B82F6', type: 'Greek', cx: 540, cy: 250, size: 28, influence: 'Center of learning', population: '~500,000', description: 'Biblical Greek usage', manuscripts: ['Papyrus 52'], variants: ['κύριος/δεσπότης'], paradigm: 'πιστεύω', lsj: 'πιστεύω: to believe, trust', semantic_drift: 'πιστεύω: "trust" → "believe" → "rely on"', polytonic: 'πιστεύω, πιστεύεις, πιστεύει' },
      { id: 'lyon', name: 'Lugdunum', language: 'Vulgar Latin', color: '#DC2626', type: 'Latin', cx: 280, cy: 120, size: 15, influence: 'Emerging Romance dialects', population: '~50,000', description: 'Provincial Latin variations', manuscripts: ['Graffiti'], variants: ['aqua/aiga'], paradigm: 'parabolare', lsj: 'N/A (Latin)', semantic_drift: 'parabolare: "speak" → "tell" → "chat"', polytonic: 'N/A' }
    ],
    284: [
      { id: 'rome', name: 'Rome', language: 'Late Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 30, influence: 'Administrative Latin', population: '~800,000', description: 'Legal and administrative texts', manuscripts: ['Codex Theodosianus'], variants: ['constitutio/lex'], paradigm: 'administro', lsj: 'N/A (Latin)', semantic_drift: 'administro: "manage" → "administer" → "govern"', polytonic: 'N/A' },
      { id: 'constantinople', name: 'Constantinople', language: 'Koinē Greek', color: '#3B82F6', type: 'Greek', cx: 550, cy: 170, size: 32, influence: 'Imperial Greek', population: '~500,000', description: 'Christian theological texts', manuscripts: ['Codex Sinaiticus'], variants: ['θεός/κύριος'], paradigm: 'δοξάζω', lsj: 'δοξάζω: to glorify, praise', semantic_drift: 'δοξάζω: "think" → "glorify" → "worship"', polytonic: 'δοξάζω, δοξάζεις, δοξάζει' },
      { id: 'carthage', name: 'Carthage', language: 'Late Latin', color: '#DC2626', type: 'Latin', cx: 320, cy: 270, size: 20, influence: 'North African Latin', population: '~200,000', description: 'Patristic theological texts', manuscripts: ['Augustine Conf.'], variants: ['anima/spiritus'], paradigm: 'credo', lsj: 'N/A (Latin)', semantic_drift: 'credo: "believe" → "trust" → "rely on"', polytonic: 'N/A' }
    ],
    600: [
      { id: 'constantinople', name: 'Constantinople', language: 'Medieval Greek', color: '#3B82F6', type: 'Greek', cx: 550, cy: 170, size: 35, influence: 'Byzantine Empire', population: '~300,000', description: 'Liturgical and administrative Greek', manuscripts: ['Codex Alexandrinus'], variants: ['δεσπότης/βασιλεύς'], paradigm: 'εὐλογέω', lsj: 'εὐλογέω: to speak well of, bless', semantic_drift: 'εὐλογέω: "praise" → "bless" → "consecrate"', polytonic: 'εὐλογέω, εὐλογέεις, εὐλογέει' },
      { id: 'rome', name: 'Rome', language: 'Vulgar Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 25, influence: 'Emerging Romance languages', population: '~50,000', description: 'Early Italian dialects', manuscripts: ['Formulary'], variants: ['caballus/equus'], paradigm: 'cantare', lsj: 'N/A (Latin)', semantic_drift: 'cantare: "sing" → "chant" → "praise"', polytonic: 'N/A' },
      { id: 'toledo', name: 'Toletum', language: 'Visigothic Latin', color: '#DC2626', type: 'Latin', cx: 260, cy: 200, size: 18, influence: 'Visigothic Kingdom', population: '~30,000', description: 'Legal and religious documents', manuscripts: ['Lex Visigothorum'], variants: ['pax/fredus'], paradigm: 'iudicare', lsj: 'N/A (Latin)', semantic_drift: 'iudicare: "judge" → "decide" → "assess"', polytonic: 'N/A' }
    ]
  };

  const regions = allRegions[selectedEra] || [];

  const handleEraClick = (year: number) => {
    setSelectedEra(year);
    setSelectedRegion(null);
  };

  const handleRegionHover = (regionId: string | null) => {
    setHoveredRegion(regionId);
  };

  const handleRegionClick = (regionId: string | null) => {
    setSelectedRegion(regionId);
  };

    const selectedRegionData = regions.find(region => region.id === selectedRegion);

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', transition: 'background-color 0.3s ease' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#C9A227', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
        Languages of the Ancient World
      </h1>

      {/* Era Selection */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        {eras.map((era) => (
          <button
            key={era.year}
            onClick={() => handleEraClick(era.year)}
            style={{
              backgroundColor: selectedEra === era.year ? era.color : '#1E1E24',
              color: '#F5F4F2',
              padding: '10px 20px',
              margin: '0 5px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              transform: selectedEra === era.year ? 'scale(1.1)' : 'scale(1)',
              boxShadow: selectedEra === era.year ? '0 4px 8px rgba(0,0,0,0.3)' : 'none',
            }}
          >
            {era.label}
          </button>
        ))}
      </div>

      {/* Language Type Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
        {languageTypes.map((type) => (
          <div key={type.name} style={{ display: 'flex', alignItems: 'center', margin: '5px 10px', fontSize: '0.9rem' }}>
            <span style={{ color: type.color, fontWeight: 'bold', marginRight: '5px' }}>{type.symbol}</span>
            <span>{type.name}</span>
          </div>
        ))}
      </div>

      {/* Map Visualization */}
      <div style={{ position: 'relative', width: '800px', height: '400px', backgroundColor: '#141419', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>
        <svg width="800" height="400" viewBox="0 0 800 400">
          {/* Map Background (Replace with actual map SVG path) */}
          <path d="M 10,50 L 250,50 L 280, 120 L 700,120 L 790,250 L 790,350 L 700,350 L 680, 280 L 100,280 L 10, 50 Z" fill="#1E1E24" />


          {regions.map((region) => (
            <circle
              key={region.id}
              cx={region.cx}
              cy={region.cy}
              r={region.size}
              fill={region.color}
              opacity={hoveredRegion === region.id || selectedRegion === region.id ? 1 : 0.7}
              style={{
                cursor: 'pointer',
                transition: 'opacity 0.3s ease, transform 0.2s ease',
                transform: hoveredRegion === region.id ? 'scale(1.2)' : 'scale(1)',
              }}
              onMouseEnter={() => handleRegionHover(region.id)}
              onMouseLeave={() => handleRegionHover(null)}
              onClick={() => handleRegionClick(region.id)}
              title={region.name}
            />
          ))}
        </svg>
      </div>

      {/* Region Details */}
      {selectedRegionData && (
        <div style={{ marginTop: '30px', width: '80%', maxWidth: '800px', backgroundColor: '#1E1E24', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.5)', transition: 'all 0.3s ease' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#C9A227', marginBottom: '10px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>{selectedRegionData.name}</h2>
          <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Language:</span> {selectedRegionData.language} ({selectedRegionData.type})
          </p>
          <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Influence:</span> {selectedRegionData.influence}
          </p>
           <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Population:</span> {selectedRegionData.population}
          </p>
          <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Description:</span> {selectedRegionData.description}
          </p>
          <details style={{ marginTop: '10px', backgroundColor: '#0D0D0F', color: '#9CA3AF', borderRadius: '5px', padding: '10px', transition: 'background-color 0.3s ease' }}>
            <summary style={{ fontWeight: 'bold', color: '#F5F4F2', cursor: 'pointer' }}>Manuscripts</summary>
            <ul style={{ listStyleType: 'none', paddingLeft: '0', marginTop: '5px' }}>
              {selectedRegionData.manuscripts.map((manuscript, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>{manuscript}</li>
              ))}
            </ul>
          </details>
          <details style={{ marginTop: '10px', backgroundColor: '#0D0D0F', color: '#9CA3AF', borderRadius: '5px', padding: '10px', transition: 'background-color 0.3s ease' }}>
            <summary style={{ fontWeight: 'bold', color: '#F5F4F2', cursor: 'pointer' }}>Variants</summary>
            <ul style={{ listStyleType: 'none', paddingLeft: '0', marginTop: '5px' }}>
              {selectedRegionData.variants.map((variant, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>{variant}</li>
              ))}
            </ul>
          </details>
          <details style={{ marginTop: '10px', backgroundColor: '#0D0D0F', color: '#9CA3AF', borderRadius: '5px', padding: '10px', transition: 'background-color 0.3s ease' }}>
            <summary style={{ fontWeight: 'bold', color: '#F5F4F2', cursor: 'pointer' }}>Paradigm</summary>
              <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>{selectedRegionData.paradigm}</p>
          </details>
            <details style={{ marginTop: '10px', backgroundColor: '#0D0D0F', color: '#9CA3AF', borderRadius: '5px', padding: '10px', transition: 'background-color 0.3s ease' }}>
            <summary style={{ fontWeight: 'bold', color: '#F5F4F2', cursor: 'pointer' }}>LSJ Entry</summary>
              <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>{selectedRegionData.lsj}</p>
          </details>
          <details style={{ marginTop: '10px', backgroundColor: '#0D0D0F', color: '#9CA3AF', borderRadius: '5px', padding: '10px', transition: 'background-color 0.3s ease' }}>
            <summary style={{ fontWeight: 'bold', color: '#F5F4F2', cursor: 'pointer' }}>Semantic Drift</summary>
              <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>{selectedRegionData.semantic_drift}</p>
          </details>
            <details style={{ marginTop: '10px', backgroundColor: '#0D0D0F', color: '#9CA3AF', borderRadius: '5px', padding: '10px', transition: 'background-color 0.3s ease' }}>
            <summary style={{ fontWeight: 'bold', color: '#F5F4F2', cursor: 'pointer' }}>Polytonic Form</summary>
              <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>{selectedRegionData.polytonic}</p>
          </details>
        </div>
      )}
          <footer style={{ marginTop: '40px', color: '#9CA3AF', textAlign: 'center' }}>
        &copy; 2024 Logos Professional Design System
      </footer>
    </div>
  );
}