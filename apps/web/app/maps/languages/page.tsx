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
      { id: 'delphi', name: 'Delphi', language: 'Delphic Greek', color: '#3B82F6', type: 'Greek', cx: 470, cy: 170, size: 15, influence: 'Religious authority', population: '~10,000', description: 'Oracular inscriptions', manuscripts: ['FD III'], variants: ['ἱερός/σακρός'], paradigm: 'μαντεύω', lsj: 'μαντεύω: to divine, prophesy', semantic_drift: 'μαντεύω: "be mad" → "prophesy" → "interpret"', polytonic: 'μαντεύω, μαντεύεις, μαντεύει' }
    ],
    323: [
      { id: 'alexandria', name: 'Alexandria', language: 'Koinē Greek', color: '#3B82F6', type: 'Greek', cx: 540, cy: 250, size: 30, influence: 'Hellenistic scholarship', population: '~400,000', description: 'Scholarly koinē standard', manuscripts: ['P.Hibeh', 'P.Petrie'], variants: ['σύνταξις/τάξις'], paradigm: 'συντάσσω', lsj: 'συντάσσω: to arrange together', semantic_drift: 'συντάσσω: "arrange" → "compose" → "organize"', polytonic: 'συντάσσω, συντάσσεις, συντάσσει' },
      { id: 'antioch', name: 'Antioch', language: 'Koinē Greek', color: '#3B82F6', type: 'Greek', cx: 580, cy: 180, size: 25, influence: 'Eastern Hellenization', population: '~200,000', description: 'Administrative Greek', manuscripts: ['P.Dura'], variants: ['πόλις/κώμη'], paradigm: 'οἰκέω', lsj: 'οἰκέω: to inhabit, dwell', semantic_drift: 'οἰκέω: "dwell" → "manage" → "rule"', polytonic: 'οἰκέω, οἰκεῖς, οἰκεῖ' },
      { id: 'pergamon', name: 'Pergamon', language: 'Koinē Greek', color: '#3B82F6', type: 'Greek', cx: 510, cy: 150, size: 20, influence: 'Library culture', population: '~120,000', description: 'Parchment production center', manuscripts: ['P.Berol'], variants: ['βιβλίον/χάρτης'], paradigm: 'γράφω', lsj: 'γράφω: to scratch, draw, write', semantic_drift: 'γράφω: "scratch" → "draw" → "write"', polytonic: 'γράφω, γράφεις, γράφει' },
      { id: 'rome', name: 'Rome', language: 'Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 22, influence: 'Mediterranean expansion', population: '~200,000', description: 'Administrative lingua franca', manuscripts: ['Senatus consultum'], variants: ['imperium/potestas'], paradigm: 'impero', lsj: 'N/A (Latin)', semantic_drift: 'impero: "order" → "command" → "rule"', polytonic: 'N/A' }
    ],
    31: [
      { id: 'constantinople', name: 'Constantinople', language: 'Byzantine Greek', color: '#3B82F6', type: 'Greek', cx: 500, cy: 170, size: 35, influence: 'Imperial administration', population: '~500,000', description: 'Christian theological Greek', manuscripts: ['Codex Sinaiticus'], variants: ['θεολογία/φιλοσοφία'], paradigm: 'θεολογέω', lsj: 'θεολογέω: to discourse of the gods', semantic_drift: 'θεολογέω: "speak of gods" → "do theology" → "theologize"', polytonic: 'θεολογέω, θεολογεῖς, θεολογεῖ' },
      { id: 'rome', name: 'Rome', language: 'Imperial Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 40, influence: 'Universal empire', population: '~1,000,000', description: 'Legal and administrative standard', manuscripts: ['Corpus Juris'], variants: ['civis/peregrinus'], paradigm: 'administro', lsj: 'N/A (Latin)', semantic_drift: 'administro: "serve" → "manage" → "govern"', polytonic: 'N/A' }
    ],
    284: [
      { id: 'constantinople', name: 'Constantinople', language: 'Medieval Greek', color: '#3B82F6', type: 'Greek', cx: 500, cy: 170, size: 30, influence: 'Christian empire', population: '~400,000', description: 'Administrative and theological', manuscripts: ['Patrologia Graeca'], variants: ['οἰκουμένη/κόσμος'], paradigm: 'διοικέω', lsj: 'διοικέω: to manage a house', semantic_drift: 'διοικέω: "manage house" → "administer" → "govern"', polytonic: 'διοικέω, διοικεῖς, διοικεῖ' },
      { id: 'ravenna', name: 'Ravenna', language: 'Late Latin', color: '#DC2626', type: 'Latin', cx: 350, cy: 160, size: 20, influence: 'Western capital', population: '~50,000', description: 'Transitional Latin forms', manuscripts: ['Codex Argenteus'], variants: ['vulgaris/classicus'], paradigm: 'regno', lsj: 'N/A (Latin)', semantic_drift: 'regno: "rule" → "reign" → "govern"', polytonic: 'N/A' }
    ],
    600: [
      { id: 'constantinople', name: 'Constantinople', language: 'Byzantine Greek', color: '#059669', type: 'Greek', cx: 500, cy: 170, size: 25, influence: 'Surviving Eastern Empire', population: '~300,000', description: 'Ecclesiastical and scholarly', manuscripts: ['Byzantine manuscripts'], variants: ['ῥωμαῖος/ἕλλην'], paradigm: 'βασιλεύω', lsj: 'βασιλεύω: to be king, rule', semantic_drift: 'βασιλεύω: "be king" → "rule" → "reign over"', polytonic: 'βασιλεύω, βασιλεύεις, βασιλεύει' }
    ]
  };

  const currentRegions = allRegions[selectedEra] || [];
  const currentEra = eras.find(era => era.year === selectedEra);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const renderInfluenceConnections = () => {
    const connections: JSX.Element[] = [];
    
    currentRegions.forEach((region, index) => {
      currentRegions.slice(index + 1).forEach(otherRegion => {
        if (region.type === otherRegion.type) {
          const opacity = hoveredRegion === region.id || hoveredRegion === otherRegion.id ? 0.6 : 0.2;
          connections.push(
            <line
              key={`${region.id}-${otherRegion.id}`}
              x1={region.cx}
              y1={region.cy}
              x2={otherRegion.cx}
              y2={otherRegion.cy}
              stroke={region.color}
              strokeWidth="1"
              opacity={opacity}
              strokeDasharray="3,3"
              style={{
                transition: 'opacity 0.3s ease',
                filter: 'drop-shadow(0 0 2px rgba(201, 162, 39, 0.3))'
              }}
            />
          );
        }
      });
    });
    
    return connections;
  };

  const renderWordEmbeddings = () => {
    if (!showWordEmbeddings || !selectedRegion) return null;
    
    const region = currentRegions.find(r => r.id === selectedRegion);
    if (!region) return null;

    const words = [
      { word: 'λόγος', x: 100, y: 100, similarity: 0.9 },
      { word: 'λέγω', x: 150, y: 120, similarity: 0.8 },
      { word: 'διάλεκτος', x: 200, y: 90, similarity: 0.7 },
      { word: 'φωνή', x: 120, y: 150, similarity: 0.6 },
      { word: 'γλῶσσα', x: 180, y: 140, similarity: 0.75 }
    ];

    return (
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '300px',
        height: '200px',
        backgroundColor: '#1E1E24',
        borderRadius: '12px',
        border: '1px solid #C9A227',
        padding: '16px'
      }}>
        <h4 style={{ color: '#F5F4F2', margin: '0 0 12px 0', fontSize: '14px' }}>
          Word Embeddings: {region.paradigm}
        </h4>
        <svg width="100%" height="150">
          {words.map((word, i) => (
            <g key={i}>
              <circle
                cx={word.x}
                cy={word.y}
                r={word.similarity * 8}
                fill={region.color}
                opacity={0.6}
                style={{
                  animation: `pulse 2s ease-in-out infinite ${i * 0.2}s`
                }}
              />
              <text
                x={word.x}
                y={word.y + 4}
                textAnchor="middle"
                fontSize="10"
                fill="#F5F4F2"
                fontFamily="'Noto Sans', sans-serif"
              >
                {word.word}
              </text>
            </g>
          ))}
          {words.map((word, i) => 
            words.slice(i + 1).map((otherWord, j) => (
              <line
                key={`${i}-${j}`}
                x1={word.x}
                y1={word.y}
                x2={otherWord.x}
                y2={otherWord.y}
                stroke="#C9A227"
                strokeWidth={Math.max(0.5, (word.similarity + otherWord.similarity) / 4)}
                opacity={0.3}
              />
            ))
          )}
        </svg>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2',
      fontFamily: "'Noto Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }} onMouseMove={handleMouseMove}>
      
      {/* Animated background particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0
      }}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '2px',
              height: '2px',
              backgroundColor: '#C9A227',
              borderRadius: '50%',
              opacity: Math.random() * 0.5,
              animation: `float 20s linear infinite ${Math.random() * 20}s`,
              transform: `translateZ(0) translateX(${Math.sin(animationPhase / 10 + i) * 10}px)`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        padding: '20px',
        background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
        borderBottom: '2px solid #C9A227',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #C9A227 0%, #F5F4F2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(201, 162, 39, 0.3)'
            }}>
              Ancient Languages Interactive Map
            </h1>
            <p style={{ margin: '8px 0 0 0', color: '#9CA3AF', fontSize: '16px' }}>
              Explore linguistic evolution across the Mediterranean • {currentEra?.name} Period ({currentEra?.label})
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {['map', 'network', 'timeline'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: viewMode === mode ? '#C9A227' : '#1E1E24',
                  color: viewMode === mode ? '#0D0D0F' : '#F5F4F2',
                  border: `1px solid ${viewMode === mode ? '#C9A227' : '#6B7280'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s ease'
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Era Timeline */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '20px',
        background: '#141419',
        borderBottom: '1px solid #6B7280'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', overflowX: 'auto' }}>
          {eras.map((era, index) => (
            <div
              key={era.year}
              onClick={() => setSelectedEra(era.year)}
              style={{
                position: 'relative',
                cursor: 'pointer',
                padding: '12px 20px',
                borderRadius: '8px',
                backgroundColor: selectedEra === era.year ? era.color : '#1E1E24',
                border: `2px solid ${selectedEra === era.year ? era.color : 'transparent'}`,
                color: selectedEra === era.year ? '#0D0D0F' : '#F5F4F2',
                minWidth: '120px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                transform: selectedEra === era.year ? 'scale(1.05)' : 'scale(1)',
                boxShadow: selectedEra === era.year ? `0 0 20px ${era.color}40` : 'none'
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: '600' }}>{era.label}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{era.name}</div>
              {selectedEra === era.year && (
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '8px',
                  height: '8px',
                  backgroundColor: era.color,
                  borderRadius: '50%',
                  animation: 'pulse 2s ease-in-out infinite'
                }}/>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Language Types Legend */}
      <div style={{
        position: 'absolute',
        top: '140px',
        left: '20px',
        zIndex: 20,
        backgroundColor: '#1E1E24',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #C9A227',
        backdropFilter: 'blur(10px)',
        maxWidth: '200px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#C9A227' }}>Language Families</h3>
        {languageTypes.map(type => (
          <div key={type.name} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '8px 0',
            fontSize: '14px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: type.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#F5F4F2'
            }}>
              {type.symbol}
            </div>
            <span>{type.name}</span>
          </div>
        ))}
      </div>

      {/* Controls Panel */}
      <div style={{
        position: 'absolute',
        top: '140px',
        right: '20px',
        zIndex: 20,
        backgroundColor: '#1E1E24',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #C9A227',
        backdropFilter: 'blur(10px)',
        minWidth: '220px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#C9A227' }}>Analysis Tools</h3>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showCriticalApparatus}
            onChange={(e) => setShowCriticalApparatus(e.target.checked)}
            style={{ accentColor: '#C9A227' }}
          />
          <span style={{ fontSize: '14px' }}>Critical Apparatus</span>
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showParadigms}
            onChange={(e) => setShowParadigms(e.target.checked)}
            style={{ accentColor: '#C9A227' }}
          />
          <span style={{ fontSize: '14px' }}>Morphological Paradigms</span>
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showWordEmbeddings}
            onChange={(e) => setShowWordEmbeddings(e.target.checked)}
            style={{ accentColor: '#C9A227' }}
          />
          <span style={{ fontSize: '14px' }}>Word Embeddings</span>
        </label>
      </div>

      {/* Main Map Container */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        padding: '20px',
        height: 'calc(100vh - 200px)',
        overflow: 'hidden'
      }}>
        <svg
          ref={mapRef}
          width="100%"
          height="100%"
          viewBox="0 0 800 400"
          style={{
            background: 'radial-gradient(ellipse at center, #141419 0%, #0D0D0F 100%)',
            borderRadius: '12px',
            border: '1px solid #6B7280'
          }}
        >
          {/* Mediterranean coastline */}
          <path
            d="M 100 300 Q 200 250 300 280 Q 400 260 500 280 Q 600 270 700 290"
            stroke="#6B7280"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
            strokeDasharray="5,5"
          />
          
          {/* Influence connections */}
          {renderInfluenceConnections()}
          
          {/* Region nodes */}
          {currentRegions.map((region, index) => {
            const isHovered = hoveredRegion === region.id;
            const isSelected = selectedRegion === region.id;
            const pulseDelay = index * 0.2;
            
            return (
              