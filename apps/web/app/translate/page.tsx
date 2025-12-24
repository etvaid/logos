'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Word forms dictionary
const WORD_FORMS: Record<string, { translation: string; type: string; forms: string; etymology?: string; lsj?: string; embedding?: number[]; semanticHistory?: Array<{period: string; meaning: string; evidence: string; color: string}> }> = {
  // Greek words
  "μῆνιν": {
    translation: "wrath, rage",
    type: "noun (accusative)",
    forms: "μῆνις, μῆνιδος (f.)",
    etymology: "From Proto-Indo-European *mēnis-",
    lsj: "μῆνις, ιδος, ἡ, wrath, anger, esp. of the gods",
    embedding: [0.2, 0.8, 0.1, 0.9, 0.3],
    semanticHistory: [
      { period: "Archaic", meaning: "divine wrath", evidence: "Homer Il. 1.1", color: "#D97706" },
      { period: "Classical", meaning: "human anger", evidence: "Aeschylus Ag. 155", color: "#F59E0B" },
      { period: "Hellenistic", meaning: "resentment", evidence: "Polybius 1.35.6", color: "#3B82F6" }
    ]
  },
  "ἄειδε": {
    translation: "sing!",
    type: "verb (imperative 2sg)",
    forms: "ἀείδω, ἀείσω, ἤεισα",
    etymology: "From *aweyd- 'to sing'",
    lsj: "ἀείδω, sing, chant, esp. epic poetry",
    embedding: [0.7, 0.3, 0.8, 0.2, 0.6]
  },
  "θεὰ": {
    translation: "goddess",
    type: "noun (vocative)",
    forms: "θεός, θεοῦ (m./f.)",
    etymology: "From *dheh₁s- 'divine'",
    lsj: "θεός, οῦ, ὁ, ἡ, god, goddess, divine being",
    embedding: [0.9, 0.1, 0.7, 0.8, 0.4]
  },
  "λόγος": {
    translation: "word, reason",
    type: "noun (nominative)",
    forms: "λόγος, λόγου (m.)",
    etymology: "From *leg- 'to gather, speak'",
    lsj: "λόγος, ου, ὁ, word, speech, reason, account",
    embedding: [0.5, 0.9, 0.3, 0.7, 0.8],
    semanticHistory: [
      { period: "Archaic", meaning: "speech, tale", evidence: "Homer Od. 1.56", color: "#D97706" },
      { period: "Classical", meaning: "reason, argument", evidence: "Heraclitus DK 22 B1", color: "#F59E0B" },
      { period: "Hellenistic", meaning: "divine principle", evidence: "Stoic sources", color: "#3B82F6" },
      { period: "Imperial", meaning: "Christian Logos", evidence: "John 1:1", color: "#DC2626" }
    ]
  },
  // Latin words
  "arma": {
    translation: "arms, weapons",
    type: "noun (accusative pl.)",
    forms: "arma, armōrum (n.)",
    etymology: "From *h₂er- 'to fit together'",
    embedding: [0.8, 0.2, 0.9, 0.1, 0.5]
  },
  "virumque": {
    translation: "and the man",
    type: "noun (acc.) + enclitic",
    forms: "vir, virī (m.) + -que",
    etymology: "From *wiHrós 'man'",
    embedding: [0.6, 0.4, 0.7, 0.3, 0.8]
  },
  "virtus": {
    translation: "virtue, courage",
    type: "noun (nominative)",
    forms: "virtūs, virtūtis (f.)",
    etymology: "From vir 'man' + -tūs",
    embedding: [0.4, 0.8, 0.2, 0.9, 0.6],
    semanticHistory: [
      { period: "Archaic", meaning: "manliness, physical strength", evidence: "Ennius Ann. 363", color: "#D97706" },
      { period: "Classical", meaning: "moral excellence", evidence: "Cicero Rep. 1.2", color: "#F59E0B" },
      { period: "Imperial", meaning: "Christian virtue", evidence: "Augustine Conf. 8.1", color: "#DC2626" },
      { period: "Late Antique", meaning: "ascetic virtue", evidence: "Jerome Ep. 22.7", color: "#7C3AED" }
    ]
  }
};

// Manuscript variants
const MANUSCRIPT_VARIANTS: Record<string, Array<{ms: string; reading: string; date: string; location: string}>> = {
  "μῆνιν": [
    { ms: "A (Venetus A)", reading: "μῆνιν", date: "10th c.", location: "Venice" },
    { ms: "B (Venetus B)", reading: "μῆνιν", date: "11th c.", location: "Venice" },
    { ms: "T (Townleyanus)", reading: "μῆνιν", date: "11th c.", location: "London" }
  ],
  "ἄειδε": [
    { ms: "A", reading: "ἄειδε", date: "10th c.", location: "Venice" },
    { ms: "B", reading: "ἄειδε", date: "11th c.", location: "Venice" },
    { ms: "Π¹", reading: "εἰδε", date: "12th c.", location: "Paris" }
  ],
  "arma": [
    { ms: "M (Mediceus)", reading: "arma", date: "5th c.", location: "Florence" },
    { ms: "P (Palatinus)", reading: "arma", date: "4th-5th c.", location: "Vatican" },
    { ms: "R (Romanus)", reading: "arma", date: "5th c.", location: "Vatican" }
  ],
  "λόγος": [
    { ms: "P.Oxy. 2069", reading: "λόγος", date: "3rd c. CE", location: "Oxyrhynchus" },
    { ms: "Laurentianus", reading: "λόγος", date: "9th c.", location: "Florence" }
  ]
};

// Example sentences
const EXAMPLE_SENTENCES = [
  {
    id: 1,
    language: "Greek",
    indicator: "Α",
    color: "#3B82F6",
    text: "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος",
    translation: "Sing, goddess, of the wrath of Achilles, son of Peleus",
    source: "Homer, Iliad 1.1",
    period: "Archaic"
  },
  {
    id: 2,
    language: "Greek",
    indicator: "Α",
    color: "#3B82F6",
    text: "ἐν ἀρχῇ ἦν ὁ λόγος",
    translation: "In the beginning was the Word",
    source: "John 1:1",
    period: "Imperial"
  },
  {
    id: 3,
    language: "Latin",
    indicator: "L",
    color: "#DC2626",
    text: "Arma virumque cano, Troiae qui primus ab oris",
    translation: "I sing of arms and the man, who first from the shores of Troy",
    source: "Virgil, Aeneid 1.1",
    period: "Imperial"
  }
];

// Declension tables
const PARADIGM_TABLES: Record<string, {type: string; forms: Array<{case: string; singular: string; plural: string}>}> = {
  "μῆνις": {
    type: "Third Declension (Feminine)",
    forms: [
      { case: "Nominative", singular: "μῆνις", plural: "μήνιδες" },
      { case: "Genitive", singular: "μήνιδος", plural: "μηνίδων" },
      { case: "Dative", singular: "μήνιδι", plural: "μήνισι(ν)" },
      { case: "Accusative", singular: "μῆνιν", plural: "μήνιδας" },
      { case: "Vocative", singular: "μῆνι", plural: "μήνιδες" }
    ]
  },
  "λόγος": {
    type: "Second Declension (Masculine)",
    forms: [
      { case: "Nominative", singular: "λόγος", plural: "λόγοι" },
      { case: "Genitive", singular: "λόγου", plural: "λόγων" },
      { case: "Dative", singular: "λόγῳ", plural: "λόγοις" },
      { case: "Accusative", singular: "λόγον", plural: "λόγους" },
      { case: "Vocative", singular: "λόγε", plural: "λόγοι" }
    ]
  }
};

export default function MorphologicalAnalysis() {
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSentence, setSelectedSentence] = useState(EXAMPLE_SENTENCES[0]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleWordClick = (word: string) => {
    setActiveWord(word === activeWord ? null : word);
    setActiveTab('overview');
  };

  const renderSemanticVisualization = (word: string) => {
    const wordData = WORD_FORMS[word];
    if (!wordData?.embedding) return null;

    const center = { x: 150, y: 100 };
    const radius = 60;

    return (
      <div style={{
        background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(201, 162, 39, 0.2)',
        padding: '24px',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `
      }}>
        <h4 style={{ 
          color: '#F5F4F2', 
          marginBottom: '16px', 
          fontSize: '18px',
          fontWeight: '600',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
        }}>
          Semantic Embedding
        </h4>
        <svg width="300" height="200" style={{ display: 'block', margin: '0 auto' }}>
          <defs>
            <radialGradient id="semanticGradient" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#C9A227" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background grid */}
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(201, 162, 39, 0.1)" strokeWidth="1"/>
          </pattern>
          <rect width="300" height="200" fill="url(#grid)" />
          
          {/* Semantic space */}
          <circle cx={center.x} cy={center.y} r={radius} fill="url(#semanticGradient)" />
          
          {/* Embedding dimensions */}
          {wordData.embedding.map((value, index) => {
            const angle = (index * 2 * Math.PI) / wordData.embedding!.length;
            const x = center.x + Math.cos(angle) * radius * value;
            const y = center.y + Math.sin(angle) * radius * value;
            
            return (
              <g key={index}>
                <line
                  x1={center.x}
                  y1={center.y}
                  x2={x}
                  y2={y}
                  stroke="#C9A227"
                  strokeWidth="2"
                  filter="url(#glow)"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#C9A227"
                  filter="url(#glow)"
                >
                  <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                </circle>
                <text
                  x={x + (Math.cos(angle) * 15)}
                  y={y + (Math.sin(angle) * 15)}
                  fill="#9CA3AF"
                  fontSize="10"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {`D${index + 1}`}
                </text>
              </g>
            );
          })}
          
          {/* Center point */}
          <circle cx={center.x} cy={center.y} r="3" fill="#F5F4F2" />
        </svg>
      </div>
    );
  };

  const renderSemanticHistory = (word: string) => {
    const wordData = WORD_FORMS[word];
    if (!wordData?.semanticHistory) return null;

    return (
      <div style={{
        background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(201, 162, 39, 0.2)',
        padding: '24px',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `
      }}>
        <h4 style={{ 
          color: '#F5F4F2', 
          marginBottom: '20px', 
          fontSize: '18px',
          fontWeight: '600',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
        }}>
          Semantic Evolution
        </h4>
        <div style={{ position: 'relative', paddingLeft: '24px' }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute',
            left: '8px',
            top: '0',
            bottom: '0',
            width: '2px',
            background: 'linear-gradient(180deg, #C9A227, rgba(201, 162, 39, 0.2))'
          }} />
          
          {wordData.semanticHistory.map((entry, index) => (
            <div key={index} style={{
              position: 'relative',
              marginBottom: '24px',
              paddingLeft: '24px'
            }}>
              {/* Timeline dot */}
              <div style={{
                position: 'absolute',
                left: '-16px',
                top: '8px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: entry.color,
                border: '2px solid #0D0D0F',
                boxShadow: `0 0 12px ${entry.color}40`
              }} />
              
              <div style={{
                backgroundColor: 'rgba(15, 15, 19, 0.6)',
                borderRadius: '12px',
                border: `1px solid ${entry.color}40`,
                padding: '16px',
                transform: 'translateZ(0)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) translateZ(0)';
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(0, 0, 0, 0.3), 0 0 20px ${entry.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) translateZ(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    backgroundColor: entry.color,
                    color: '#0D0D0F',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginRight: '12px'
                  }}>
                    {entry.period}
                  </span>
                  <span style={{
                    color: '#F5F4F2',
                    fontWeight: '500'
                  }}>
                    {entry.meaning}
                  </span>
                </div>
                <div style={{
                  color: '#9CA3AF',
                  fontSize: '14px',
                  fontStyle: 'italic'
                }}>
                  {entry.evidence}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderParadigm = (word: string) => {
    const baseForm = word === 'μῆνιν' ? 'μῆνις' : word;
    const paradigm = PARADIGM_TABLES[baseForm];
    if (!paradigm) return null;

    return (
      <div style={{
        background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(201, 162, 39, 0.2)',
        padding: '24px',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `
      }}>
        <h4 style={{ 
          color: '#F5F4F2', 
          marginBottom: '16px', 
          fontSize: '18px',
          fontWeight: '600',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
        }}>
          {paradigm.type}
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1px',
          backgroundColor: 'rgba(201, 162, 39, 0.2)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: '#C9A227',
            color: '#0D0D0F',
            padding: '12px',
            fontWeight: '600',
            textAlign: 'center'
          }}>Case</div>
          <div style={{
            backgroundColor: '#C9A227',
            color: '#0D0D0F',
            padding: '12px',
            fontWeight: '600',
            textAlign: 'center'
          }}>Singular</div>
          <div style={{
            backgroundColor: '#C9A227',
            color: '#0D0D0F',
            padding: '12px',
            fontWeight: '600',
            textAlign: 'center'
          }}>Plural</div>
          
          {/* Rows */}
          {paradigm.forms.map((form, index) => (
            <>
              <div key={`case-${index}`} style={{
                backgroundColor: '#1E1E24',
                color: '#9CA3AF',
                padding: '12px',
                fontWeight: '500'
              }}>{form.case}</div>
              <div key={`sg-${index}`} style={{
                backgroundColor: '#141419',
                color: '#F5F4F2',
                padding: '12px',
                fontFamily: 'Georgia, serif',
                fontSize: '16px',
                textAlign: 'center',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (form.singular === word) {
                  e.currentTarget.style.backgroundColor = 'rgba(201, 162, 39, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#141419';
              }}>
                {form.singular}
                {form.singular === word && (
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    border: '2px solid #C9A227',
                    borderRadius: '4px',
                    pointerEvents: 'none'
                  }} />
                )}
              </div>
              <div key={`pl-${index}`} style={{
                backgroundColor: '#141419',
                color: '#F5F4F2',
                padding: '12px',
                fontFamily: 'Georgia, serif',
                fontSize: '16px',
                textAlign: 'center'
              }}>{form.plural}</div>
            </>
          ))}
        </div>
      </div>
    );
  };

  const renderManuscriptVariants = (word: string) => {
    const variants = MANUSCRIPT_VARIANTS[word];
    if (!variants) return null;

    return (
      <div style={{
        background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(201, 162, 39, 0.2)',
        padding: '24px',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `
      }}>
        <h4 style={{ 
          color: '#F5F4F2', 
          marginBottom: '20px', 
          fontSize: '18px',
          fontWeight: '600',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
        }}>
          Manuscript Tradition
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {variants.map((variant, index) => (
            <div key={index} style={{
              background: 'linear-gradient(135deg, rgba(15, 15, 19, 0.8) 0%, rgba(30, 30, 36, 0.4) 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(107, 114, 128, 0.2)',
              padding: '16px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.4)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 162, 39, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.2)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{
                    color: '#C9A227',
                    fontWeight: '600',
                    marginRight: '12px'
                  }}>
                    {variant.ms}
                  </span>
                  <span style={{
                    color: '#F5F4F2',
                    fontFamily: 'Georgia, serif',
                    fontSize: '18px'
                  }}>
                    {variant.reading}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#9CA3AF', fontSize: '14px' }}>
                    {variant.date}
                  </div>
                  <div style={{ color: '#6B7280', fontSize: '12px' }}>
                    {variant.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2',
      overflow: 'hidden'
    }} ref={containerRef}>
      
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        pointerEvents: 'none'
      }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="morphPattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <circle cx="60" cy="60" r="2" fill="#C9A227" opacity="0.5">
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" />
              </circle>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#morphPattern)" />
        </svg>
      </div>

      {/* Floating orbs */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            backgroundColor: '#C9A227',
            borderRadius: '50%',
            opacity: 0.1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            pointerEvents: 'none',
            filter: 'blur(1px)',
            zIndex: 1
          }}
        />
      ))}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        background: 'linear-gradient(135deg, rgba(30, 30, 36, 0.95) 0%, rgba(20, 20, 25, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201, 162, 39, 0.2)',
        padding: '24px 0'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              margin: 0,
              background: 'linear-gradient(135deg, #F5F4F2 0%, #C9A227 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none'
            }