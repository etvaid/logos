'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ChronosPage() {
  const [selectedConcept, setSelectedConcept] = useState<string>('ἀρετή');
  const [expandedNode, setExpandedNode] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showApparatus, setShowApparatus] = useState<boolean>(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [embeddingView, setEmbeddingView] = useState<boolean>(false);
  const [showParadigm, setShowParadigm] = useState<boolean>(false);
  const [hoveredEmbedding, setHoveredEmbedding] = useState<string | null>(null);
  const [selectedEra, setSelectedEra] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const concepts = {
    'ἀρετή': {
      transliteration: 'aretē',
      modern: 'virtue',
      lsj: 'LSJ s.v. ἀρετή: I. goodness, excellence of any kind. II. esp. of moral virtue',
      paradigm: {
        nom_sg: 'ἀρετή',
        gen_sg: 'ἀρετῆς',
        dat_sg: 'ἀρετῇ',
        acc_sg: 'ἀρετήν',
        nom_pl: 'ἀρεταί',
        gen_pl: 'ἀρετῶν',
        dat_pl: 'ἀρεταῖς',
        acc_pl: 'ἀρετάς'
      },
      manuscripts: [
        { siglum: 'A', reading: 'ἀρετή', confidence: 95 },
        { siglum: 'B', reading: 'ἀρετά', confidence: 12 },
        { siglum: 'V', reading: 'ἀρετή', confidence: 88 },
        { siglum: 'P', reading: 'ἀρετήν', confidence: 45 }
      ],
      embeddings: [
        { word: 'καλοκἀγαθία', similarity: 0.89, x: 120, y: 80 },
        { word: 'σοφία', similarity: 0.82, x: 180, y: 120 },
        { word: 'δικαιοσύνη', similarity: 0.78, x: 220, y: 160 },
        { word: 'ἀνδρεία', similarity: 0.76, x: 100, y: 200 },
        { word: 'σωφροσύνη', similarity: 0.74, x: 280, y: 140 },
        { word: 'εὐδαιμονία', similarity: 0.71, x: 240, y: 100 },
        { word: 'φρόνησις', similarity: 0.69, x: 160, y: 240 }
      ],
      data: [
        {
          era: 'Archaic',
          period: '800-500 BCE',
          meaning: 'Battle excellence, prowess in war',
          evolution: 'Originally referred to any kind of excellence or effectiveness, especially in warfare. Heroes in Homer displayed arete through brave deeds and martial skill.',
          authors: ['Homer', 'Hesiod', 'Tyrtaeus'],
          confidence: 92,
          color: '#D97706',
          year: -800,
          position: 0,
          example: 'ἀνδρὸς ἀρετήν τε καὶ εὐκλείην',
          translation: 'the excellence and glory of a man',
          apparatus: 'ἀρετήν A V : ἀρετά B : ἀρετὰν P.Oxy. 1234',
          context: 'Homeric poetry, heroic ideals'
        },
        {
          era: 'Classical',
          period: '500-323 BCE',
          meaning: 'Moral excellence, ethical virtue',
          evolution: 'Transformed into moral and intellectual excellence. Plato divided it into four cardinal virtues: wisdom, courage, temperance, and justice. Aristotle refined it as the mean between extremes.',
          authors: ['Plato', 'Aristotle', 'Xenophon'],
          confidence: 95,
          color: '#F59E0B',
          year: -500,
          position: 1,
          example: 'ἀρετὴ ἐπιστήμη ἐστί',
          translation: 'virtue is knowledge',
          apparatus: 'ἐπιστήμη A B V : ἐπιστήμης Stobaeus',
          context: 'Socratic paradox, philosophical ethics'
        },
        {
          era: 'Hellenistic',
          period: '323-31 BCE',
          meaning: 'Philosophical virtue, wisdom',
          evolution: 'Became central to philosophical schools as practical wisdom for living well. Stoics emphasized virtue as the only true good, while Epicureans saw it as instrumental to happiness.',
          authors: ['Chrysippus', 'Epicurus', 'Cleanthes'],
          confidence: 88,
          color: '#3B82F6',
          year: -323,
          position: 2,
          example: 'μόνον τὸ καλὸν ἀγαθόν',
          translation: 'virtue alone is good',
          apparatus: 'καλὸν A : κάλλος B : om. V',
          context: 'Stoic doctrine, Hellenistic schools'
        },
        {
          era: 'Imperial',
          period: '31 BCE-284 CE',
          meaning: 'Civic virtue, public duty',
          evolution: 'Emphasized as civic responsibility and public service. Roman authors like Plutarch highlighted virtue in leadership and citizenship, while Marcus Aurelius stressed personal virtue in public life.',
          authors: ['Plutarch', 'Marcus Aurelius', 'Epictetus'],
          confidence: 85,
          color: '#DC2626',
          year: -31,
          position: 3,
          example: 'τῆς πολιτικῆς ἀρετῆς',
          translation: 'of civic virtue',
          apparatus: 'πολιτικῆς A B : πολιτειακῆς V',
          context: 'Roman imperial philosophy'
        },
        {
          era: 'Late Antique',
          period: '284-600 CE',
          meaning: 'Christian virtue, divine grace',
          evolution: 'Christianized as divine gift and moral perfection through grace. Church fathers integrated classical virtue ethics with Christian theology.',
          authors: ['John Chrysostom', 'Gregory Nazianzen', 'Basil'],
          confidence: 82,
          color: '#7C3AED',
          year: 284,
          position: 4,
          example: 'θεία ἀρετὴ καὶ χάρις',
          translation: 'divine virtue and grace',
          apparatus: 'θεία A : θεῖα B V : om. P',
          context: 'Patristic theology, Christian ethics'
        },
        {
          era: 'Byzantine',
          period: '600-1453 CE',
          meaning: 'Imperial virtue, orthodox piety',
          evolution: 'Synthesized into imperial ideology and orthodox Christian practice. Emphasized as both personal sanctity and imperial responsibility.',
          authors: ['Photius', 'Psellus', 'Gemistos Plethon'],
          confidence: 78,
          color: '#059669',
          year: 600,
          position: 5,
          example: 'βασιλικὴ ἀρετὴ καὶ εὐσέβεια',
          translation: 'imperial virtue and piety',
          apparatus: 'βασιλικὴ A B : βασιλεία V',
          context: 'Byzantine court, imperial theology'
        }
      ]
    },
    'σοφία': {
      transliteration: 'sophia',
      modern: 'wisdom',
      lsj: 'LSJ s.v. σοφία: I. cleverness or skill in handicraft and art. II. wisdom in matters of conduct',
      paradigm: {
        nom_sg: 'σοφία',
        gen_sg: 'σοφίας',
        dat_sg: 'σοφίᾳ',
        acc_sg: 'σοφίαν',
        nom_pl: 'σοφίαι',
        gen_pl: 'σοφιῶν',
        dat_pl: 'σοφίαις',
        acc_pl: 'σοφίας'
      },
      manuscripts: [
        { siglum: 'A', reading: 'σοφία', confidence: 92 },
        { siglum: 'B', reading: 'σοφίη', confidence: 25 },
        { siglum: 'V', reading: 'σοφία', confidence: 90 }
      ],
      embeddings: [
        { word: 'ἐπιστήμη', similarity: 0.91, x: 140, y: 90 },
        { word: 'φρόνησις', similarity: 0.85, x: 190, y: 130 },
        { word: 'γνῶσις', similarity: 0.82, x: 120, y: 180 }
      ],
      data: [
        {
          era: 'Archaic',
          period: '800-500 BCE',
          meaning: 'Skill, craftmanship',
          evolution: 'Originally denoted technical skill and expertise in crafts, arts, or practical knowledge.',
          authors: ['Homer', 'Hesiod'],
          confidence: 88,
          color: '#D97706',
          year: -800,
          position: 0,
          example: 'τέκτονος σοφίη',
          translation: 'carpenter\'s skill',
          apparatus: 'σοφίη A B : σοφία V',
          context: 'Craft guilds, technical expertise'
        }
      ]
    }
  };

  const conceptKeys = Object.keys(concepts);
  const currentConcept = concepts[selectedConcept as keyof typeof concepts];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
        borderBottom: '1px solid #C9A227',
        padding: '20px 0'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link href="/" style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#C9A227',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <svg width="32" height="32" viewBox="0 0 32 32" style={{ fill: '#C9A227' }}>
                <circle cx="16" cy="16" r="14" stroke="#C9A227" strokeWidth="2" fill="none"/>
                <path d="M16 6 L16 16 L24 16" stroke="#C9A227" strokeWidth="2" fill="none"/>
                <circle cx="16" cy="16" r="2" fill="#C9A227"/>
              </svg>
              CHRONOS
            </Link>
            <div style={{ color: '#9CA3AF', fontSize: '16px' }}>
              Semantic Evolution Through Time
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  backgroundColor: '#1E1E24',
                  border: '1px solid #C9A227',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  color: '#F5F4F2',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '16px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2A2A34';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(201, 162, 39, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1E1E24';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ 
                  color: '#3B82F6', 
                  fontSize: '18px', 
                  marginRight: '4px' 
                }}>Α</span>
                {selectedConcept}
                <svg width="16" height="16" viewBox="0 0 16 16" style={{ fill: '#9CA3AF', transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </button>

              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  right: '0',
                  backgroundColor: '#1E1E24',
                  border: '1px solid #C9A227',
                  borderRadius: '8px',
                  marginTop: '8px',
                  zIndex: 1000,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {conceptKeys.map((concept) => (
                    <button
                      key={concept}
                      onClick={() => {
                        setSelectedConcept(concept);
                        setShowDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: concept === selectedConcept ? 'rgba(201, 162, 39, 0.1)' : 'transparent',
                        border: 'none',
                        color: '#F5F4F2',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderBottom: '1px solid #333',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(201, 162, 39, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = concept === selectedConcept ? 'rgba(201, 162, 39, 0.1)' : 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#3B82F6', fontSize: '16px' }}>Α</span>
                        {concept}
                        <span style={{ color: '#9CA3AF', fontSize: '14px', marginLeft: 'auto' }}>
                          {concepts[concept as keyof typeof concepts].transliteration}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setEmbeddingView(!embeddingView)}
                style={{
                  backgroundColor: embeddingView ? '#C9A227' : '#1E1E24',
                  border: '1px solid #C9A227',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: embeddingView ? '#0D0D0F' : '#C9A227',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                Embeddings
              </button>
              <button
                onClick={() => setShowParadigm(!showParadigm)}
                style={{
                  backgroundColor: showParadigm ? '#C9A227' : '#1E1E24',
                  border: '1px solid #C9A227',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: showParadigm ? '#0D0D0F' : '#C9A227',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                Paradigm
              </button>
              <button
                onClick={() => setShowApparatus(!showApparatus)}
                style={{
                  backgroundColor: showApparatus ? '#C9A227' : '#1E1E24',
                  border: '1px solid #C9A227',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: showApparatus ? '#0D0D0F' : '#C9A227',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                Apparatus
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        {/* Concept Header */}
        <div style={{
          backgroundColor: '#1E1E24',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(201, 162, 39, 0.2)',
          background: 'linear-gradient(135deg, #1E1E24 0%, #1A1A20 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{
              backgroundColor: '#3B82F6',
              color: '#F5F4F2',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              Α
            </div>
            <div>
              <h1 style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#F5F4F2',
                margin: '0 0 8px 0',
                letterSpacing: '-0.02em'
              }}>
                {selectedConcept}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{
                  fontSize: '20px',
                  color: '#C9A227',
                  fontStyle: 'italic'
                }}>
                  {currentConcept.transliteration}
                </span>
                <span style={{
                  fontSize: '18px',
                  color: '#9CA3AF'
                }}>
                  "{currentConcept.modern}"
                </span>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#141419',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(201, 162, 39, 0.1)'
          }}>
            <div style={{ color: '#6B7280', fontSize: '14px', marginBottom: '8px' }}>
              Liddell-Scott-Jones Dictionary
            </div>
            <div style={{ color: '#F5F4F2', fontSize: '16px', lineHeight: '1.5' }}>
              {currentConcept.lsj}
            </div>
          </div>
        </div>

        {/* Paradigm Modal */}
        {showParadigm && (
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(201, 162, 39, 0.2)'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#C9A227',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#C9A227">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#C9A227" strokeWidth="2" fill="none"/>
              </svg>
              Morphological Paradigm
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px'
            }}>
              {Object.entries(currentConcept.paradigm).map(([form, word]) => (
                <div
                  key={form}
                  style={{
                    backgroundColor: '#141419',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid rgba(201, 162, 39, 0.1)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#C9A227';
                    e.currentTarget.style.backgroundColor = 'rgba(201, 162, 39, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.1)';
                    e.currentTarget.style.backgroundColor = '#141419';
                  }}
                >
                  <div style={{ 
                    color: '#9CA3AF', 
                    fontSize: '12px', 
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {form.replace('_', ' ')}
                  </div>
                  <div style={{ 
                    color: '#F5F4F2', 
                    fontSize: '18px',
                    fontWeight: '500'
                  }}>
                    {word}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Embeddings Visualization */}
        {embeddingView && (
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(201, 162, 39, 0.2)'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#C9A227',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#C9A227">
                <circle cx="12" cy="12" r="3" fill="#C9A227"/>
                <path d="M12 1v6m0 8v6M4.22 4.22l4.24 4.24m8.48 8.48L4.22 4.22M1 12h6m8 0h6" stroke="#C9A227" strokeWidth="2"/>
              </svg>
              Semantic Embeddings
            </h3>
            <div style={{ position: 'relative', height: '400px', backgroundColor: '#141419', borderRadius: '12px' }}>
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                {/* Central node */}
                <circle
                  cx="200"
                  cy="200"
                  r="16"
                  fill="#C9A227"
                  stroke="#F5F4F2"
                  strokeWidth="3"
                />
                <text
                  x="200"
                  y="240"
                  textAnchor="middle"
                  fill="#F5F4F2"
                  fontSize="16"
                  fontWeight="bold"
                >
                  {selectedConcept}
                </text>

                {/* Connected nodes */}
                {currentConcept.embeddings.map((embedding, index) => (
                  <g key={embedding.word}>
                    {/* Connection line */}
                    <line
                      x1="200"
                      y1="200"
                      x2={embedding.x}
                      y2={embedding.y}
                      stroke="rgba(201, 162, 39, 0.3)"
                      strokeWidth="2"
                      opacity={hoveredEmbedding === embedding.word ? 1 : 0.5}
                    />
                    {/* Node */}
                    <circle
                      cx={embedding.x}
                      cy={embedding.y}
                      r={8 + embedding.similarity * 6}
                      fill="#3B82F6"
                      stroke={hoveredEmbedding === embedding.word ? "#F5F4F2" : "none"}
                      strokeWidth="2"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredEmbedding(embedding.word)}
                      onMouseLeave={() => setHoveredEmbedding(null)}
                    />
                    {/* Label */}
                    <text
                      x={embedding.x}
                      y={embedding.y - 20}
                      textAnchor="middle"
                      fill="#F5F4F2"
                      fontSize="12"
                      opacity={hoveredEmbedding === embedding.word ? 1 : 0.8}
                    >
                      {embedding.word}
                    </text>
                    {/* Similarity score */}
                    <text
                      x={embedding.x}
                      y={embedding.y + 25}
                      textAnchor="middle"
                      fill="#9CA3AF"
                      fontSize="10"
                      opacity={hoveredEmbedding === embedding.word ? 1 : 0.6}
                    >
                      {(embedding.similarity * 100).toFixed(0)}%
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div style={{
          backgroundColor: '#1E1E24',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(201, 162, 39, 0.2)',
          background: 'linear-gradient(135deg, #1E1E24 0%, #1A1A20 100%)'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#C9A227',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="#C9A227">
              <path d="M16 2L30 16L16 30L2 16L16 2Z" stroke="#C9A227" strokeWidth="2" fill="none"/>
              <circle cx="16" cy="16" r="4" fill="#C9A227"/>
            </svg>
            Diachronic Evolution
          </h2>

          <div ref={timelineRef} style={{ position: 'relative' }}>
            {/* Timeline line */}
            <div style={{
              position: 'absolute',
              top: '120px',
              left: '60px',
              right: '60px',
              height: '4px',
              background: 'linear-gradient(90deg, #D97706 0%, #F59E0B 16%, #3B82F6 33%, #DC2626 50%, #7C3AED 66%, #059669 100%)',
              borderRadius: '2px'
            }} />

            {/* Era nodes */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 60px',
              position: 'relative',
              zIndex: 10
            }}>
              {currentConcept.data.map((era, index) => (
                <div
                  key={era.era}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease'
                  }}
                  onClick={() => setSelectedEra(selectedEra === index ? null : index)}
                  onMouseEnter={()