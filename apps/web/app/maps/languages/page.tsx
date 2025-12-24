'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function LanguagesMap() {
  const [selectedEra, setSelectedEra] = useState(500);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showCriticalApparatus, setShowCriticalApparatus] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showParadigms, setShowParadigms] = useState(false);
  const [showWordEmbeddings, setShowWordEmbeddings] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'map' | 'network' | 'timeline'>('map');
  const mapRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

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
      { id: 'rome', name: 'Rome', language: 'Classical Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 18, influence: 'Republican expansion', population: '~100,000', description: 'Legal and oratorical register', manuscripts: ['Codex Ambrosianus'], variants: ['honos/honor'], paradigm: 'amo', lsj: 'N/A (Latin)', semantic_drift: 'honos: "honor" → "office" → "glory"', polytonic: 'N/A' },
      { id: 'delphi', name: 'Delphi', language: 'Delphic Greek', color: '#3B82F6', type: 'Greek', cx: 470, cy: 170, size: 15, influence: 'Religious authority', population: '~10,000', description: 'Oracular inscriptions', manuscripts: ['CID I'], variants: ['θεός/θεός'], paradigm: 'χράω', lsj: 'χράω: to proclaim, divine', semantic_drift: 'χράω: "touch" → "use" → "divine"', polytonic: 'χράω, χρῇς, χρῇ' },
      { id: 'massalia', name: 'Massalia', language: 'Phocaean Greek', color: '#3B82F6', type: 'Greek', cx: 300, cy: 190, size: 12, influence: 'Trade and colonization', population: '~50,000', description: 'Western Greek colonies', manuscripts: ['Marseille Inscription'], variants: ['πόλις/πτόλις'], paradigm: 'οἰκέω', lsj: 'οἰκέω: to inhabit, dwell', semantic_drift: 'οἰκέω: "settle" → "inhabit" → "manage"', polytonic: 'οἰκέω, οἰκεῖς, οἰκεῖ' }
    ]
  };

  const regions = allRegions[selectedEra] || [];

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId);
  };

  const selectedRegionData = regions.find(region => region.id === selectedRegion);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', transition: 'background-color 0.3s ease' }}>
      <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', marginBottom: '20px', color: '#C9A227', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
        Languages Map
      </h1>

      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '20px' }}>
        {eras.map((era) => (
          <button
            key={era.year}
            onClick={() => setSelectedEra(era.year)}
            style={{
              backgroundColor: selectedEra === era.year ? era.color : '#1E1E24',
              color: '#F5F4F2',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              boxShadow: selectedEra === era.year ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.2)',
              transform: selectedEra === era.year ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {era.label}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative', width: '800px', height: '600px', backgroundColor: '#1E1E24', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)' }}>
        <svg
          ref={mapRef}
          width="800"
          height="600"
          style={{ transition: 'transform 0.3s ease' }}
          onMouseMove={handleMouseMove}
        >
          <image href="/europe_map.png" width="800" height="600" />
          {regions.map((region) => (
            <circle
              key={region.id}
              cx={region.cx}
              cy={region.cy}
              r={region.size}
              fill={region.color}
              opacity={hoveredRegion === region.id || selectedRegion === region.id ? 0.8 : 0.5}
              style={{ cursor: 'pointer', transition: 'opacity 0.3s ease' }}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => handleRegionClick(region.id)}
            />
          ))}
          {/* Add a subtle glow effect */}
          {hoveredRegion && (
            <>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {regions.filter(region => region.id === hoveredRegion).map(region => (
                <circle
                  key={`glow-${region.id}`}
                  cx={region.cx}
                  cy={region.cy}
                  r={region.size + 5}
                  fill={region.color}
                  opacity={0.3}
                  filter="url(#glow)"
                  style={{ pointerEvents: 'none' }}
                />
              ))}
            </>
          )}
        </svg>
      </div>

      {selectedRegionData && (
        <div style={{ marginTop: '20px', backgroundColor: '#1E1E24', padding: '20px', borderRadius: '10px', width: '600px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', transition: 'transform 0.2s ease', transform: hoveredRegion === selectedRegionData.id ? 'scale(1.02)' : 'scale(1)' }}>
          <h2 style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '10px' }}>{selectedRegionData.name}</h2>
          <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>Language: {selectedRegionData.language} ({selectedRegionData.type})</p>
          <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>Influence: {selectedRegionData.influence}</p>
          <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>Population: {selectedRegionData.population}</p>
          <p style={{ color: '#F5F4F2', marginBottom: '10px' }}>{selectedRegionData.description}</p>
          <h3 style={{ fontSize: '1.2em', color: '#C9A227', marginBottom: '5px' }}>Linguistic Details</h3>
          <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>Manuscripts: {selectedRegionData.manuscripts.join(', ')}</p>
          <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>Variants: {selectedRegionData.variants.join(', ')}</p>
          <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>Paradigm: {selectedRegionData.paradigm}</p>
          <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>LSJ Definition: {selectedRegionData.lsj}</p>
          <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>Semantic Drift: {selectedRegionData.semantic_drift}</p>
          <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>Polytonic Example: {selectedRegionData.polytonic}</p>
        </div>
      )}
    </div>
  );
}