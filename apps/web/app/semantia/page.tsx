'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface WordData {
  word: string;
  translit: string;
  traditional: string;
  corpus: string;
  count: number;
  drift: { era: string; meaning: string; confidence: number; color: string; year: number }[];
  insight: string;
  paradigm: { form: string; greek: string; function: string }[];
  manuscripts: { sigla: string; reading: string; date: string; confidence: number }[];
  embedding: { x: number; y: number; era: string; color: string }[];
  lsj: { definition: string; etymology: string; cognates: string[] };
}

const WORDS: Record<string, WordData> = {
  "ἀρετή": {
    word: "ἀρετή", translit: "aretē", traditional: "virtue",
    corpus: "excellence → moral virtue → Christian virtue",
    count: 2847,
    drift: [
      { era: "Archaic", meaning: "Excellence in battle, prowess", confidence: 92, color: "#D97706", year: -700 },
      { era: "Classical", meaning: "Moral excellence, virtue of soul", confidence: 95, color: "#F59E0B", year: -400 },
      { era: "Hellenistic", meaning: "Philosophical virtue, wisdom", confidence: 88, color: "#3B82F6", year: -150 },
      { era: "Late Antique", meaning: "Christian moral virtue", confidence: 90, color: "#7C3AED", year: 400 },
    ],
    insight: "LSJ misses the crucial shift from Homeric 'battle prowess' to Platonic 'moral virtue'. LOGOS corpus shows ἀρετή meant physical excellence 78% of the time in archaic texts, vs only 12% in classical philosophy.",
    paradigm: [
      { form: "Nom. Sg.", greek: "ἀρετή", function: "Subject" },
      { form: "Gen. Sg.", greek: "ἀρετῆς", function: "Possession" },
      { form: "Dat. Sg.", greek: "ἀρετῇ", function: "Indirect object" },
      { form: "Acc. Sg.", greek: "ἀρετήν", function: "Direct object" }
    ],
    manuscripts: [
      { sigla: "P.Oxy. 1806", reading: "ἀρετή", date: "3rd c. CE", confidence: 96 },
      { sigla: "Vat. gr. 1", reading: "ἀρεταί", date: "10th c. CE", confidence: 89 },
      { sigla: "Marc. gr. 454", reading: "ἀρετῆς", date: "15th c. CE", confidence: 92 }
    ],
    embedding: [
      { x: 20, y: 80, era: "Archaic", color: "#D97706" },
      { x: 45, y: 40, era: "Classical", color: "#F59E0B" },
      { x: 70, y: 60, era: "Hellenistic", color: "#3B82F6" },
      { x: 85, y: 30, era: "Late Antique", color: "#7C3AED" }
    ],
    lsj: {
      definition: "goodness, excellence, of any kind esp. of manly qualities, manhood, valour, prowess",
      etymology: "from ἀρι- (intensive) + -ετή (abstract suffix)",
      cognates: ["ἄριστος", "ἀρείων", "ἀρετάω"]
    }
  },
  "λόγος": {
    word: "λόγος", translit: "logos", traditional: "word, reason",
    corpus: "speech → reason → cosmic principle → divine Word",
    count: 12453,
    drift: [
      { era: "Archaic", meaning: "Speech, story, account", confidence: 94, color: "#D97706", year: -650 },
      { era: "Classical", meaning: "Reason, rational argument", confidence: 96, color: "#F59E0B", year: -350 },
      { era: "Hellenistic", meaning: "Cosmic reason, natural law", confidence: 91, color: "#3B82F6", year: -100 },
      { era: "Late Antique", meaning: "Divine Word, Christ", confidence: 93, color: "#7C3AED", year: 300 },
    ],
    insight: "The most dramatic semantic transformation in Greek. From Homer's 'story' to Heraclitus' 'cosmic principle' to John's 'divine Word' - this single term encapsulates the entire intellectual history of the ancient world.",
    paradigm: [
      { form: "Nom. Sg.", greek: "λόγος", function: "Subject" },
      { form: "Gen. Sg.", greek: "λόγου", function: "Possession" },
      { form: "Dat. Sg.", greek: "λόγῳ", function: "Indirect object" },
      { form: "Acc. Sg.", greek: "λόγον", function: "Direct object" }
    ],
    manuscripts: [
      { sigla: "P.Herc. 1673", reading: "λόγος", date: "1st c. BCE", confidence: 98 },
      { sigla: "Cod. Sinait.", reading: "λόγου", date: "4th c. CE", confidence: 95 },
      { sigla: "Par. gr. 1807", reading: "λόγον", date: "9th c. CE", confidence: 91 }
    ],
    embedding: [
      { x: 15, y: 70, era: "Archaic", color: "#D97706" },
      { x: 40, y: 45, era: "Classical", color: "#F59E0B" },
      { x: 65, y: 25, era: "Hellenistic", color: "#3B82F6" },
      { x: 90, y: 15, era: "Late Antique", color: "#7C3AED" }
    ],
    lsj: {
      definition: "computation, reckoning; relation, proportion, analogy; explanation; inward debate of the soul; continuous statement, narrative; word, speech; reason",
      etymology: "from λέγω (to say, collect, count)",
      cognates: ["λέγω", "λεκτός", "διάλογος", "ἀνάλογος"]
    }
  },
  "σῶμα": {
    word: "σῶμα", translit: "sōma", traditional: "body",
    corpus: "corpse → living body → cosmic body → mystical body",
    count: 8924,
    drift: [
      { era: "Archaic", meaning: "Dead body, corpse", confidence: 89, color: "#D97706", year: -750 },
      { era: "Classical", meaning: "Living body, physical form", confidence: 93, color: "#F59E0B", year: -450 },
      { era: "Hellenistic", meaning: "Material substance, cosmic body", confidence: 87, color: "#3B82F6", year: -200 },
      { era: "Late Antique", meaning: "Church as mystical body", confidence: 91, color: "#7C3AED", year: 350 },
    ],
    insight: "Semantic broadening from death to life to cosmos. Homer's σῶμα is always a corpse; Plato's is the soul's prison; Paul's is Christ's mystical unity. The body's conceptual journey mirrors Greek thought itself.",
    paradigm: [
      { form: "Nom. Sg.", greek: "σῶμα", function: "Subject" },
      { form: "Gen. Sg.", greek: "σώματος", function: "Possession" },
      { form: "Dat. Sg.", greek: "σώματι", function: "Indirect object" },
      { form: "Acc. Sg.", greek: "σῶμα", function: "Direct object" }
    ],
    manuscripts: [
      { sigla: "P.Oxy. 3525", reading: "σῶμα", date: "2nd c. CE", confidence: 94 },
      { sigla: "Vat. gr. 2061", reading: "σώματος", date: "11th c. CE", confidence: 88 },
      { sigla: "Laur. plut. 32.16", reading: "σώματι", date: "14th c. CE", confidence: 90 }
    ],
    embedding: [
      { x: 25, y: 85, era: "Archaic", color: "#D97706" },
      { x: 50, y: 55, era: "Classical", color: "#F59E0B" },
      { x: 75, y: 35, era: "Hellenistic", color: "#3B82F6" },
      { x: 80, y: 20, era: "Late Antique", color: "#7C3AED" }
    ],
    lsj: {
      definition: "body (as opp. to soul), dead body, corpse; the body of a tree; any solid body; a person, individual",
      etymology: "from σῴζω (to save, preserve) - what is preserved",
      cognates: ["σωματικός", "σωματοποιέω", "ἀσώματος"]
    }
  }
};

export default function SemanticDriftPage() {
  const [selectedWord, setSelectedWord] = useState<string>("ἀρετή");
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredEra, setHoveredEra] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number>();

  const wordData = WORDS[selectedWord];

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setAnimationProgress(prev => {
          const next = prev + 0.5;
          if (next >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const renderTimelineVisualization = () => {
    return (
      <div style={{
        backgroundColor: '#1E1E24',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid #2D2D35',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, #C9A227 0%, #C9A227 ${animationProgress}%, rgba(201, 162, 39, 0.1) ${animationProgress}%)`
        }} />
        
        <h3 style={{
          color: '#F5F4F2',
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#3B82F6',
            borderRadius: '50%'
          }} />
          Semantic Evolution Timeline
        </h3>

        <svg width="100%" height="400" style={{ marginBottom: '24px' }}>
          {/* Timeline axis */}
          <line x1="80" y1="350" x2="920" y2="350" stroke="#6B7280" strokeWidth="2"/>
          
          {/* Year markers */}
          {[-800, -500, -300, 0, 300, 600].map((year, i) => (
            <g key={year}>
              <line x1={80 + i * 168} y1="340" x2={80 + i * 168} y2="360" stroke="#6B7280" strokeWidth="1"/>
              <text x={80 + i * 168} y="380" fill="#9CA3AF" fontSize="12" textAnchor="middle">
                {year > 0 ? `${year} CE` : `${Math.abs(year)} BCE`}
              </text>
            </g>
          ))}

          {/* Semantic drift path */}
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {wordData.drift.map((point, i) => (
                <stop key={i} offset={`${(i / (wordData.drift.length - 1)) * 100}%`} stopColor={point.color} stopOpacity="0.8"/>
              ))}
            </linearGradient>
          </defs>

          {/* Connect the dots with flowing path */}
          {wordData.drift.map((point, i) => {
            if (i === wordData.drift.length - 1) return null;
            const nextPoint = wordData.drift[i + 1];
            const x1 = 80 + ((point.year + 800) / 1400) * 840;
            const y1 = 50 + (point.confidence / 100) * 250;
            const x2 = 80 + ((nextPoint.year + 800) / 1400) * 840;
            const y2 = 50 + (nextPoint.confidence / 100) * 250;
            
            return (
              <g key={i}>
                <path
                  d={`M ${x1} ${y1} Q ${x1 + (x2 - x1) / 2} ${Math.min(y1, y2) - 30} ${x2} ${y2}`}
                  stroke="url(#pathGradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={isPlaying ? "5,5" : "none"}
                  style={{
                    animation: isPlaying ? 'dash 2s linear infinite' : 'none'
                  }}
                />
              </g>
            );
          })}

          {/* Era points */}
          {wordData.drift.map((point, i) => {
            const x = 80 + ((point.year + 800) / 1400) * 840;
            const y = 50 + (point.confidence / 100) * 250;
            const isHovered = hoveredEra === point.era;
            
            return (
              <g key={point.era}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 12 : 8}
                  fill={point.color}
                  stroke="#F5F4F2"
                  strokeWidth="2"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    filter: isHovered ? 'drop-shadow(0 0 12px rgba(255,255,255,0.3))' : 'none'
                  }}
                  onMouseEnter={() => setHoveredEra(point.era)}
                  onMouseLeave={() => setHoveredEra(null)}
                />
                
                {/* Era label */}
                <text
                  x={x}
                  y={y - 20}
                  fill="#F5F4F2"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                  style={{ pointerEvents: 'none' }}
                >
                  {point.era}
                </text>

                {/* Hover tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={x - 120}
                      y={y + 20}
                      width="240"
                      height="60"
                      fill="#0D0D0F"
                      stroke={point.color}
                      strokeWidth="1"
                      rx="8"
                      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}
                    />
                    <text x={x} y={y + 40} fill="#F5F4F2" fontSize="12" fontWeight="600" textAnchor="middle">
                      {point.meaning}
                    </text>
                    <text x={x} y={y + 55} fill="#9CA3AF" fontSize="10" textAnchor="middle">
                      Confidence: {point.confidence}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              backgroundColor: isPlaying ? '#DC2626' : '#C9A227',
              color: '#0D0D0F',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isPlaying ? '⏹ Stop Animation' : '▶ Animate Evolution'}
          </button>
        </div>

        <style jsx>{`
          @keyframes dash {
            to {
              stroke-dashoffset: -10;
            }
          }
        `}</style>
      </div>
    );
  };

  const renderSemanticSpace = () => {
    return (
      <div style={{
        backgroundColor: '#1E1E24',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid #2D2D35'
      }}>
        <h3 style={{
          color: '#F5F4F2',
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#DC2626',
            borderRadius: '50%'
          }} />
          Semantic Space Embedding
        </h3>

        <svg width="100%" height="400">
          <defs>
            <radialGradient id="spaceGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(201, 162, 39, 0.1)" />
              <stop offset="100%" stopColor="rgba(13, 13, 15, 0.8)" />
            </radialGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#spaceGradient)" />

          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <g key={i} opacity="0.1">
              <line x1={i * 200} y1="0" x2={i * 200} y2="400" stroke="#F5F4F2" strokeWidth="1"/>
              <line x1="0" y1={i * 100} x2="800" y2={i * 100} stroke="#F5F4F2" strokeWidth="1"/>
            </g>
          ))}

          {/* Embedding trajectory */}
          {wordData.embedding.map((point, i) => {
            if (i === wordData.embedding.length - 1) return null;
            const nextPoint = wordData.embedding[i + 1];
            return (
              <line
                key={i}
                x1={point.x * 8}
                y1={400 - point.y * 4}
                x2={nextPoint.x * 8}
                y2={400 - nextPoint.y * 4}
                stroke={point.color}
                strokeWidth="2"
                strokeDasharray="3,3"
                opacity="0.6"
              />
            );
          })}

          {/* Embedding points */}
          {wordData.embedding.map((point, i) => (
            <g key={point.era}>
              <circle
                cx={point.x * 8}
                cy={400 - point.y * 4}
                r="10"
                fill={point.color}
                stroke="#F5F4F2"
                strokeWidth="2"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))',
                  animation: `pulse-${i} 3s ease-in-out infinite`
                }}
              />
              <text
                x={point.x * 8}
                y={400 - point.y * 4 - 15}
                fill="#F5F4F2"
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
              >
                {point.era}
              </text>
            </g>
          ))}
        </svg>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginTop: '24px',
          fontSize: '14px',
          color: '#9CA3AF'
        }}>
          <div>
            <strong style={{ color: '#F5F4F2' }}>X-Axis:</strong> Semantic Concreteness
          </div>
          <div>
            <strong style={{ color: '#F5F4F2' }}>Y-Axis:</strong> Cultural Abstraction
          </div>
        </div>

        <style jsx>{`
          @keyframes pulse-0 { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }
          @keyframes pulse-1 { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }
          @keyframes pulse-2 { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }
          @keyframes pulse-3 { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }
        `}</style>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2'
    }}>
      {/* Navigation */}
      <nav style={{
        borderBottom: '1px solid #2D2D35',
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(13, 13, 15, 0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '32px'
        }}>
          <Link href="/" style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#C9A227',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#C9A227',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0D0D0F',
              fontWeight: '900'
            }}>Λ</div>
            LOGOS
          </Link>

          <div style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center'
          }}>
            <Link href="/search" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '16px', fontWeight: '500' }}>
              Search
            </Link>
            <Link href="/browse" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '16px', fontWeight: '500' }}>
              Browse
            </Link>
            <Link href="/analysis" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '16px', fontWeight: '500' }}>
              Analysis
            </Link>
            <span style={{ color: '#C9A227', fontSize: '16px', fontWeight: '600' }}>
              Semantic Drift
            </span>
          </div>
        </div>
      </nav>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '48px 24px'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #C9A227 0%, #F5F4F2 50%, #3B82F6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Semantic Drift Analysis
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#9CA3AF',
            lineHeight: '1.6',
            maxWidth: '800px'
          }}>
            Witness how Greek words evolved across millennia. Track semantic transformations that traditional dictionaries miss, 
            powered by our complete corpus analysis spanning 1,500 years of textual evidence.
          </p>
        </div>

        {/* Word Selector */}
        <div style={{
          backgroundColor: '#1E1E24',
          border: '1px solid #2D2D35',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '24px',
            color: '#F5F4F2'
          }}>
            Select Word for Analysis
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {Object.entries(WORDS).map(([word, data]) => (
              <div
                key={word}
                onClick={() => setSelectedWord(word)}
                style={{
                  padding: '24px',
                  backgroundColor: selectedWord === word ? 'rgba(201, 162, 39, 0.1)' : '#141419',
                  border: selectedWord === word ? '2px solid #C9A227' : '1px solid #2D2D35',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: selectedWord === word ? 'translateY(-2px)' : 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: '#3B82F6',
                    color: '#F5F4F2',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    Α
                  </span>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#F5F4F2'
                  }}>
                    {word}
                  </span>
                  <span style={{
                    color: '#9CA3AF',
                    fontSize: '16px'
                  }}>
                    {data.translit}
                  </span>
                </div>
                <div style={{
                  color: '#9CA3AF',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}>
                  {data.corpus}
                </div>
                <div style={{
                  color: '#6B7280',
                  fontSize: '12px'
                }}>
                  {data.count.toLocaleString()} occurrences
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '32px',
          marginBottom: '32px'
        }}>
          {renderTimelineVisualization()}
          {renderSemanticSpace()}
        </div>

        {/* Word Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px'
        }}>
          {/* LOGOS Insight */}
          <div style={{
            backgroundColor: '#1E1E24',
            border: '1px solid #2D2D35',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '16px',
              color: '#C9A227',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#C9A227',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#0D0D0F