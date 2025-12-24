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
  const mapRef = useRef<SVGSVGElement>(null);

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
      { id: 'antioch', name: 'Antioch', language: 'Koinē Greek', color: '#3B82F6', type: 'Greek', cx: 580, cy: 140, size: 25, influence: 'Eastern Hellenism', population: '~300,000', description: 'Syrian Greek synthesis', manuscripts: ['P.Dura'], variants: ['διάλεκτος/γλῶσσα'], paradigm: 'διαλέγομαι', lsj: 'διαλέγομαι: to converse, discuss', semantic_drift: 'διαλέγομαι: "select" → "discuss" → "reason"', polytonic: 'διαλέγομαι, διαλέγῃ, διαλέγεται' }
    ],
    31: [
      { id: 'rome_imperial', name: 'Rome', language: 'Imperial Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 35, influence: 'Literary Golden Age', population: '~1,000,000', description: 'Augustan literary standard', manuscripts: ['Codex Mediceus'], variants: ['caelum/coelum'], paradigm: 'impero', lsj: 'N/A (Latin)', semantic_drift: 'impero: "prepare" → "command" → "rule"', polytonic: 'N/A' },
      { id: 'constantinople', name: 'Byzantion', language: 'Koinē Greek', color: '#3B82F6', type: 'Greek', cx: 500, cy: 140, size: 20, influence: 'Eastern Greek culture', population: '~200,000', description: 'Pre-Byzantine Greek', manuscripts: ['Sinaiticus'], variants: ['βασιλεύς/ἄναξ'], paradigm: 'βασιλεύω', lsj: 'βασιλεύω: to be king, reign', semantic_drift: 'βασιλεύω: "be king" → "rule" → "dominate"', polytonic: 'βασιλεύω, βασιλεύεις, βασιλεύει' }
    ],
    284: [
      { id: 'constantinople_late', name: 'Constantinople', language: 'Byzantine Greek', color: '#3B82F6', type: 'Greek', cx: 500, cy: 140, size: 30, influence: 'Christian scholarship', population: '~500,000', description: 'Ecclesiastical Greek development', manuscripts: ['Vaticanus', 'Alexandrinus'], variants: ['θεολογία/θεοσοφία'], paradigm: 'θεολογέω', lsj: 'θεολογέω: to discourse of the gods', semantic_drift: 'θεολογέω: "speak of gods" → "theologize" → "contemplate"', polytonic: 'θεολογέω, θεολογεῖς, θεολογεῖ' },
      { id: 'ravenna', name: 'Ravenna', language: 'Late Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 160, size: 25, influence: 'Imperial administration', population: '~100,000', description: 'Administrative Late Latin', manuscripts: ['Codex Theodosianus'], variants: ['ecclesia/basilica'], paradigm: 'administro', lsj: 'N/A (Latin)', semantic_drift: 'administro: "serve" → "manage" → "govern"', polytonic: 'N/A' }
    ],
    600: [
      { id: 'constantinople_byzantine', name: 'Constantinople', language: 'Medieval Greek', color: '#059669', type: 'Greek', cx: 500, cy: 140, size: 40, influence: 'Byzantine Empire', population: '~400,000', description: 'Medieval Greek literary tradition', manuscripts: ['Photian manuscripts'], variants: ['αὐτοκράτωρ/βασιλεύς'], paradigm: 'αὐτοκρατορέω', lsj: 'αὐτοκράτωρ: having full power', semantic_drift: 'αὐτοκράτωρ: "self-ruler" → "emperor" → "sovereign"', polytonic: 'αὐτοκράτωρ, αὐτοκράτορος' },
      { id: 'rome_papal', name: 'Rome', language: 'Medieval Latin', color: '#7C3AED', type: 'Latin', cx: 340, cy: 180, size: 20, influence: 'Papal authority', population: '~50,000', description: 'Ecclesiastical Latin', manuscripts: ['Vulgate'], variants: ['papa/pontifex'], paradigm: 'benedico', lsj: 'N/A (Latin)', semantic_drift: 'benedico: "speak well" → "bless" → "consecrate"', polytonic: 'N/A' }
    ]
  };

  const currentRegions = allRegions[selectedEra] || [];
  const currentEra = eras.find(e => e.year === selectedEra);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const generateInfluenceLines = () => {
    const lines: JSX.Element[] = [];
    currentRegions.forEach((region, index) => {
      if (index > 0) {
        const prevRegion = currentRegions[index - 1];
        const distance = Math.sqrt(
          Math.pow(region.cx - prevRegion.cx, 2) + 
          Math.pow(region.cy - prevRegion.cy, 2)
        );
        
        if (distance < 150) {
          lines.push(
            <line
              key={`influence-${region.id}-${prevRegion.id}`}
              x1={region.cx}
              y1={region.cy}
              x2={prevRegion.cx}
              y2={prevRegion.cy}
              stroke={region.color}
              strokeWidth="1"
              opacity="0.3"
              style={{
                animation: `pulse 3s ease-in-out infinite ${index * 0.5}s`,
                filter: 'drop-shadow(0 0 2px currentColor)'
              }}
            />
          );
        }
      }
    });
    return lines;
  };

  const generateWordCloud = (region: any) => {
    const words = [...region.variants, region.paradigm, region.polytonic];
    return words.map((word, idx) => (
      <text
        key={`word-${idx}`}
        x={region.cx + (idx - 1) * 30}
        y={region.cy - 40 - idx * 8}
        fill={region.color}
        fontSize="10"
        opacity="0.7"
        style={{
          fontFamily: 'Georgia, serif',
          animation: `fadeInOut 4s ease-in-out infinite ${idx * 0.8}s`
        }}
      >
        {word.split('/')[0]}
      </text>
    ));
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; stroke-width: 1px; }
          50% { opacity: 0.8; stroke-width: 2px; }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 5px currentColor); }
          50% { filter: drop-shadow(0 0 15px currentColor); }
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateY(10px); }
          50% { opacity: 1; transform: translateY(0); }
        }
        @keyframes ripple {
          0% { r: 0; opacity: 1; }
          100% { r: 50; opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #F5F4F2 25%, #C9A227 50%, #F5F4F2 75%);
          background-size: 200px 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s infinite;
        }
        .floating {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Navigation */}
      <nav style={{ 
        padding: '1rem 2rem', 
        borderBottom: '1px solid #1E1E24',
        background: 'linear-gradient(135deg, #0D0D0F 0%, #141419 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            textDecoration: 'none', 
            color: '#C9A227',
            textShadow: '0 0 10px #C9A227'
          }}>
            <span className="shimmer-text">ΛΟΓΟΣ</span>
          </Link>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/manuscripts" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.3s' }}>
              Manuscripts
            </Link>
            <Link href="/lexicon" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.3s' }}>
              Lexicon
            </Link>
            <Link href="/analysis" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.3s' }}>
              Analysis
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header style={{ 
        padding: '3rem 2rem', 
        textAlign: 'center',
        background: 'radial-gradient(ellipse at center, #1E1E24 0%, #0D0D0F 100%)'
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          background: `linear-gradient(135deg, ${currentEra?.color || '#C9A227'} 0%, #F5F4F2 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 30px rgba(201, 162, 39, 0.3)'
        }}>
          Ancient Languages Visualization
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#9CA3AF', 
          maxWidth: '800px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Explore the evolution of Greek and Latin across historical periods, from Archaic Greece to the Byzantine Empire
        </p>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 200px)' }}>
        {/* Sidebar Controls */}
        <aside style={{ 
          width: '300px', 
          backgroundColor: '#141419', 
          padding: '2rem',
          borderRight: '1px solid #1E1E24',
          overflowY: 'auto'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: '#C9A227', 
              marginBottom: '1rem',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              Historical Periods
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {eras.map(era => (
                <button
                  key={era.year}
                  onClick={() => setSelectedEra(era.year)}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: selectedEra === era.year ? era.color : '#1E1E24',
                    color: selectedEra === era.year ? '#0D0D0F' : '#F5F4F2',
                    border: `1px solid ${era.color}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '0.9rem',
                    fontWeight: selectedEra === era.year ? '600' : '400',
                    boxShadow: selectedEra === era.year ? `0 0 15px ${era.color}40` : 'none'
                  }}
                >
                  {era.name} ({era.label})
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: '#C9A227', 
              marginBottom: '1rem',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              Language Types
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {languageTypes.map(type => (
                <div
                  key={type.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem',
                    backgroundColor: '#1E1E24',
                    borderRadius: '6px',
                    border: `1px solid ${type.color}30`
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: type.color,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#F5F4F2'
                  }}>
                    {type.symbol}
                  </div>
                  <span style={{ fontSize: '0.9rem' }}>{type.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ 
              color: '#C9A227', 
              marginBottom: '1rem',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              Visualization Options
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showCriticalApparatus}
                  onChange={(e) => setShowCriticalApparatus(e.target.checked)}
                  style={{ accentColor: '#C9A227' }}
                />
                <span style={{ fontSize: '0.9rem' }}>Critical Apparatus</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showParadigms}
                  onChange={(e) => setShowParadigms(e.target.checked)}
                  style={{ accentColor: '#C9A227' }}
                />
                <span style={{ fontSize: '0.9rem' }}>Paradigms</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showWordEmbeddings}
                  onChange={(e) => setShowWordEmbeddings(e.target.checked)}
                  style={{ accentColor: '#C9A227' }}
                />
                <span style={{ fontSize: '0.9rem' }}>Word Embeddings</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Map Area */}
        <main style={{ flex: 1, padding: '2rem' }}>
          <div style={{ 
            backgroundColor: '#1E1E24', 
            borderRadius: '12px', 
            padding: '2rem',
            border: '1px solid #2A2A32',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '2rem' 
            }}>
              <h2 style={{ 
                color: currentEra?.color || '#C9A227', 
                fontSize: '2rem',
                fontWeight: '700',
                textShadow: `0 0 10px ${currentEra?.color || '#C9A227'}40`
              }}>
                {currentEra?.name} Period ({currentEra?.label})
              </h2>
              <div style={{ 
                fontSize: '0.9rem', 
                color: '#9CA3AF',
                padding: '0.5rem 1rem',
                backgroundColor: '#141419',
                borderRadius: '6px',
                border: '1px solid #2A2A32'
              }}>
                {currentRegions.length} linguistic regions
              </div>
            </div>

            {/* Interactive Map SVG */}
            <svg
              ref={mapRef}
              width="100%"
              height="500"
              viewBox="0 0 800 400"
              style={{ 
                backgroundColor: '#0D0D0F',
                borderRadius: '8px',
                border: '2px solid #2A2A32'
              }}
            >
              {/* Background Mediterranean */}
              <defs>
                <radialGradient id="mapGradient" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#1E1E24" />
                  <stop offset="100%" stopColor="#0D0D0F" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <rect width="100%" height="100%" fill="url(#mapGradient)" />

              {/* Mediterranean coastlines */}
              <path
                d="M100,300 Q200,280 300,290 Q400,285 500,295 Q600,290 700,300"
                stroke="#2A2A32"
                strokeWidth="2"
                fill="none"
                opacity="0.5"
              />

              {/* Influence lines */}
              {generateInfluenceLines()}

              {/* Language regions */}
              {currentRegions.map((region, index) => (
                <g key={region.id}>
                  {/* Ripple effect for selected region */}
                  {selectedRegion === region.id && (
                    <circle
                      cx={region.cx}
                      cy={region.cy}
                      r="0"
                      fill="none"
                      stroke={region.color}
                      strokeWidth="2"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="r"
                        values="0;50;0"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="1;0;1"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Main region circle */}
                  <circle
                    cx={region.cx}
                    cy={region.cy}
                    r={region.size}
                    fill={region.color}
                    stroke={hoveredRegion === region.id ? '#C9A227' : 'transparent'}
                    strokeWidth="3"
                    opacity="0.8"
                    filter="url(#glow)"
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: hoveredRegion === region.id ? 'scale(1.2)' : 'scale(1)'
                    }}
                    onMouseEnter={() => setHoveredReg