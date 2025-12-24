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
          apparatus: 'βασιλικὴ A B : βασιλεία V : om. P',
          context: 'Byzantine court literature'
        }
      ]
    },
    'φιλοσοφία': {
      transliteration: 'philosophia',
      modern: 'philosophy',
      lsj: 'LSJ s.v. φιλοσοφία: love of wisdom, pursuit of knowledge',
      paradigm: {
        nom_sg: 'φιλοσοφία',
        gen_sg: 'φιλοσοφίας',
        dat_sg: 'φιλοσοφίᾳ',
        acc_sg: 'φιλοσοφίαν',
        nom_pl: 'φιλοσοφίαι',
        gen_pl: 'φιλοσοφιῶν',
        dat_pl: 'φιλοσοφίαις',
        acc_pl: 'φιλοσοφίας'
      },
      manuscripts: [
        { siglum: 'A', reading: 'φιλοσοφία', confidence: 98 },
        { siglum: 'B', reading: 'φιλοσοφίη', confidence: 15 },
        { siglum: 'V', reading: 'φιλοσοφία', confidence: 92 },
        { siglum: 'P', reading: 'φιλοσοφίαν', confidence: 38 }
      ],
      embeddings: [
        { word: 'σοφία', similarity: 0.91, x: 140, y: 90 },
        { word: 'ἐπιστήμη', similarity: 0.84, x: 200, y: 130 },
        { word: 'διαλεκτική', similarity: 0.79, x: 110, y: 180 },
        { word: 'μάθησις', similarity: 0.77, x: 260, y: 160 },
        { word: 'θεωρία', similarity: 0.75, x: 180, y: 240 },
        { word: 'νοῦς', similarity: 0.73, x: 250, y: 110 },
        { word: 'λόγος', similarity: 0.70, x: 120, y: 220 }
      ],
      data: [
        {
          era: 'Archaic',
          period: '800-500 BCE',
          meaning: 'Love of wisdom, inquiry',
          evolution: 'Emerging concept of systematic inquiry into nature and human affairs, distinct from mythological explanations.',
          authors: ['Pythagoras', 'Heraclitus', 'Xenophanes'],
          confidence: 85,
          color: '#D97706',
          year: -600,
          position: 0,
          example: 'φιλοσοφίης ἀρχηγός',
          translation: 'founder of philosophy',
          apparatus: 'φιλοσοφίης A : φιλοσοφίας B V',
          context: 'Pre-Socratic tradition'
        },
        {
          era: 'Classical',
          period: '500-323 BCE',
          meaning: 'Systematic knowledge, dialectic',
          evolution: 'Developed into rigorous methodology for understanding reality, ethics, and politics through rational argument.',
          authors: ['Socrates', 'Plato', 'Aristotle'],
          confidence: 98,
          color: '#F59E0B',
          year: -400,
          position: 1,
          example: 'ἡ φιλοσοφία βίος ἐστί',
          translation: 'philosophy is a way of life',
          apparatus: 'βίος A B V : βιότος P',
          context: 'Socratic-Platonic tradition'
        },
        {
          era: 'Hellenistic',
          period: '323-31 BCE',
          meaning: 'Therapeutic wisdom, eudaimonia',
          evolution: 'Focused on practical ethics and achieving happiness through rational understanding of nature and human psychology.',
          authors: ['Epicurus', 'Zeno', 'Pyrrho'],
          confidence: 90,
          color: '#3B82F6',
          year: -300,
          position: 2,
          example: 'φιλοσοφία θεραπεία ψυχῆς',
          translation: 'philosophy is therapy for the soul',
          apparatus: 'θεραπεία A V : θεραπεία B : cura animae Latin',
          context: 'Hellenistic schools'
        },
        {
          era: 'Imperial',
          period: '31 BCE-284 CE',
          meaning: 'Spiritual exercise, contemplation',
          evolution: 'Emphasized as spiritual practice and moral transformation through contemplation and self-examination.',
          authors: ['Seneca', 'Marcus Aurelius', 'Plotinus'],
          confidence: 87,
          color: '#DC2626',
          year: 100,
          position: 3,
          example: 'φιλοσοφία ἄσκησις θανάτου',
          translation: 'philosophy is practice for death',
          apparatus: 'ἄσκησις A B : μελέτη V',
          context: 'Imperial Stoicism, Neoplatonism'
        },
        {
          era: 'Late Antique',
          period: '284-600 CE',
          meaning: 'Christian wisdom, theology',
          evolution: 'Integrated with Christian theology as handmaiden to faith, preserving classical learning within Christian framework.',
          authors: ['Augustine', 'Pseudo-Dionysius', 'Boethius'],
          confidence: 84,
          color: '#7C3AED',
          year: 400,
          position: 4,
          example: 'φιλοσοφία ἀνάβασις πρὸς θεόν',
          translation: 'philosophy is ascent to God',
          apparatus: 'ἀνάβασις A : ἄνοδος B V',
          context: 'Patristic synthesis'
        },
        {
          era: 'Byzantine',
          period: '600-1453 CE',
          meaning: 'Scholastic synthesis, commentary',
          evolution: 'Preserved and transmitted through scholarly commentary tradition, integrated with theological education.',
          authors: ['John of Damascus', 'Photius', 'Gemistos Plethon'],
          confidence: 80,
          color: '#059669',
          year: 800,
          position: 5,
          example: 'φιλοσοφία παιδεία ψυχῆς',
          translation: 'philosophy is education of the soul',
          apparatus: 'παιδεία A B : παίδευσις V',
          context: 'Byzantine scholasticism'
        }
      ]
    }
  };

  const conceptKeys = Object.keys(concepts);
  const currentConcept = concepts[selectedConcept as keyof typeof concepts];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && !(event.target as Element).closest('.concept-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const getTimelinePosition = (year: number) => {
    const minYear = -800;
    const maxYear = 1453;
    return ((year - minYear) / (maxYear - minYear)) * 100;
  };

  const renderTimeline = () => (
    <div style={{ 
      position: 'relative', 
      height: '120px', 
      margin: '20px 0',
      background: 'linear-gradient(90deg, #141419 0%, #1E1E24 50%, #141419 100%)',
      borderRadius: '12px',
      padding: '20px',
      overflow: 'hidden'
    }}>
      {/* Timeline base */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '10%',
        right: '10%',
        height: '4px',
        background: 'linear-gradient(90deg, #D97706, #F59E0B, #3B82F6, #DC2626, #7C3AED, #059669)',
        borderRadius: '2px',
        transform: 'translateY(-50%)'
      }} />
      
      {/* Era nodes */}
      {currentConcept.data.map((era, index) => {
        const position = getTimelinePosition(era.year);
        const isSelected = selectedEra === index;
        const isHovered = hoveredNode === index;
        
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${10 + position * 0.8}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: isSelected || isHovered ? 10 : 5
            }}
            onMouseEnter={() => setHoveredNode(index)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => setSelectedEra(selectedEra === index ? null : index)}
          >
            {/* Node circle */}
            <div style={{
              width: isSelected || isHovered ? '20px' : '16px',
              height: isSelected || isHovered ? '20px' : '16px',
              backgroundColor: era.color,
              borderRadius: '50%',
              border: '3px solid #0D0D0F',
              boxShadow: isSelected || isHovered ? 
                `0 0 20px ${era.color}50, 0 0 40px ${era.color}30` : 
                `0 0 10px ${era.color}40`,
              transition: 'all 0.3s ease',
              position: 'relative'
            }}>
              {/* Pulse animation for selected */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '-3px',
                  left: '-3px',
                  right: '-3px',
                  bottom: '-3px',
                  borderRadius: '50%',
                  border: `2px solid ${era.color}`,
                  animation: 'pulse 2s infinite'
                }} />
              )}
            </div>
            
            {/* Era label */}
            <div style={{
              position: 'absolute',
              top: isSelected || isHovered ? '-45px' : '-35px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '11px',
              color: isSelected || isHovered ? era.color : '#9CA3AF',
              fontWeight: isSelected || isHovered ? '600' : '500',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
              textShadow: isSelected || isHovered ? `0 0 10px ${era.color}50` : 'none'
            }}>
              {era.era}
            </div>
            
            {/* Period label */}
            <div style={{
              position: 'absolute',
              top: '25px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '9px',
              color: '#6B7280',
              whiteSpace: 'nowrap',
              opacity: isSelected || isHovered ? 1 : 0.7,
              transition: 'opacity 0.3s ease'
            }}>
              {era.period}
            </div>
          </div>
        );
      })}
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );

  const renderEmbeddingCloud = () => (
    <div style={{
      position: 'relative',
      height: '300px',
      background: 'radial-gradient(circle at center, #1E1E24 0%, #141419 100%)',
      borderRadius: '12px',
      margin: '20px 0',
      overflow: 'hidden'
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute' }}>
        {/* Connection lines */}
        {currentConcept.embeddings.map((embedding, index) => (
          <line
            key={`line-${index}`}
            x1="50%"
            y1="50%"
            x2={embedding.x}
            y2={embedding.y}
            stroke={hoveredEmbedding === embedding.word ? '#C9A227' : '#6B7280'}
            strokeWidth={hoveredEmbedding === embedding.word ? '2' : '1'}
            strokeOpacity={embedding.similarity * 0.8}
            style={{ transition: 'all 0.3s ease' }}
          />
        ))}
        
        {/* Central concept */}
        <circle
          cx="50%"
          cy="50%"
          r="25"
          fill="#C9A227"
          stroke="#0D0D0F"
          strokeWidth="3"
          style={{
            filter: 'drop-shadow(0 0 20px #C9A22750)',
            animation: 'gentle-pulse 3s infinite'
          }}
        />
        
        {/* Embedding nodes */}
        {currentConcept.embeddings.map((embedding, index) => (
          <g key={index}>
            <circle
              cx={embedding.x}
              cy={embedding.y}
              r={8 + embedding.similarity * 8}
              fill="#3B82F6"
              stroke="#0D0D0F"
              strokeWidth="2"
              style={{
                cursor: 'pointer',
                filter: hoveredEmbedding === embedding.word ? 
                  'drop-shadow(0 0 15px #3B82F650)' : 
                  'drop-shadow(0 0 5px #3B82F630)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={() => setHoveredEmbedding(embedding.word)}
              onMouseLeave={() => setHoveredEmbedding(null)}
            />
            
            {/* Similarity indicator */}
            <text
              x={embedding.x}
              y={embedding.y - 20}
              textAnchor="middle"
              fontSize="10"
              fill="#F5F4F2"
              style={{
                opacity: hoveredEmbedding === embedding.word ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            >
              {(embedding.similarity * 100).toFixed(0)}%
            </text>
          </g>
        ))}
      </svg>
      
      {/* Central concept label */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#0D0D0F',
        fontWeight: '700',
        fontSize: '14px',
        pointerEvents: 'none',
        textAlign: 'center'
      }}>
        {selectedConcept}
      </div>
      
      {/* Embedding labels */}
      {currentConcept.embeddings.map((embedding, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: embedding.x,
            top: embedding.y + 25,
            transform: 'translateX(-50%)',
            fontSize: '11px',
            color: hoveredEmbedding === embedding.word ? '#C9A227' : '#9CA3AF',
            fontWeight: hoveredEmbedding === embedding.word ? '600' : '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
            textShadow: hoveredEmbedding === embedding.word ? 
              '0 0 10px #C9A22750' : 'none'
          }}
          onMouseEnter={() => setHoveredEmbedding(embedding.word)}
          onMouseLeave={() => setHoveredEmbedding(null)}
        >
          {embedding.word}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes gentle-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );

  const renderParadigm = () => (
    <div style={{
      background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
      borderRadius: '12px',
      padding: '20px',
      margin: '20px 0',
      border: '1px solid #C9A22730'
    }}>
      <h3 style={{
        color: '#C9A227',
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{
          display: 'inline-block',
          width: '20px',
          height: '20px',
          backgroundColor: '#3B82F6',
          borderRadius: '4px',
          color: '#F5F4F2',
          fontSize: '12px',
          fontWeight: '700',
          textAlign: 'center',
          lineHeight: '20px'
        }}>
          Α
        </span>
        Declension Paradigm
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px'
      }}>
        {Object.entries(currentConcept.paradigm).map(([form, word]) => (
          <div
            key={form}
            style={{
              background: 'linear-gradient(135deg, #0D0D0F 0%, #1E1E24 100%)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center',
              border: '1px solid #3B82F620',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3B82F6';
              e.currentTarget.style.boxShadow = '0 0 15px #3B82F630';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#3B82F620';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontSize: '10px',
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '5px'
            }}>
              {form.replace('_', ' ')}
            </div>
            <div style={{
              fontSize: '16px',
              color: '#3B82F6',
              fontWeight: '500',
              fontFamily: 'serif'
            }}>
              {word}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderManuscriptApparatus = () => (
    <div style={{
      background: 'linear-gradient(135deg, #141419 0%, #1E1E24 100%)',
      borderRadius: '12px',
      padding: '20px',
      margin: '20px 0',
      border: '1px solid #DC262630'
    }}>
      <h3 style={{
        color: '#DC2626',
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{
          display: 'inline-block',
          width: '20px',
          height: '20px',
          backgroundColor: '#DC2626',
          borderRadius: '4px',
          color: '#F5F4F2',
          fontSize: '12px',
          fontWeight: '700',
          textAlign: 'center',
          lineHeight: '20px'
        }}>
          L
        </span>
        Manuscript Variants
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        {currentConcept.manuscripts.map((ms, index) => (
          <div
            key={index}
            style={{
              background: `linear-gradient(135deg, #0D0D0F 0%, #1E1E24 100%)`,
              borderRadius: '8px',
              padding: '12px',
              border: `1px solid ${ms.confidence > 80 ? '#10B981' : ms.confidence > 50 ? '#F59E0B' : '#DC2626'}30`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Confidence bar */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: `${ms.confidence}%`,
              height: '3px',
              background: ms.confidence > 80 ? '#10B981' : ms.confidence > 50 ? '#F59E0B' : '#DC2626',
              borderRadius: '0 3px 0 0'
            }} />
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#F5F4F2',
                backgroundColor: '#6B7280',
                padding: '2px 6px',
                border