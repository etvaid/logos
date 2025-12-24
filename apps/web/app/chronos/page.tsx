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
          context: 'Byzantine court, imperial ideology'
        }
      ]
    },
    'λόγος': {
      transliteration: 'logos',
      modern: 'word, reason',
      lsj: 'LSJ s.v. λόγος: I. word, speech. II. reason, account. III. proportion, ratio',
      paradigm: {
        nom_sg: 'λόγος',
        gen_sg: 'λόγου',
        dat_sg: 'λόγῳ',
        acc_sg: 'λόγον',
        nom_pl: 'λόγοι',
        gen_pl: 'λόγων',
        dat_pl: 'λόγοις',
        acc_pl: 'λόγους'
      },
      manuscripts: [
        { siglum: 'A', reading: 'λόγος', confidence: 98 },
        { siglum: 'B', reading: 'λόγος', confidence: 94 },
        { siglum: 'V', reading: 'λόγον', confidence: 23 }
      ],
      embeddings: [
        { word: 'νοῦς', similarity: 0.85, x: 130, y: 90 },
        { word: 'διάνοια', similarity: 0.79, x: 190, y: 130 },
        { word: 'φρόνησις', similarity: 0.76, x: 230, y: 170 },
        { word: 'ῥῆμα', similarity: 0.74, x: 110, y: 210 },
        { word: 'μῦθος', similarity: 0.71, x: 270, y: 150 }
      ],
      data: [
        {
          era: 'Archaic',
          period: '800-500 BCE',
          meaning: 'Speech, tale, word',
          evolution: 'Basic meaning of spoken word or tale, often contrasted with μῦθος (myth).',
          authors: ['Homer', 'Hesiod'],
          confidence: 89,
          color: '#D97706',
          year: -800,
          position: 0,
          example: 'τίπτε με ταῦτα ἕκαστα διείρεαι ἠδὲ μεταλλᾷς;',
          translation: 'why do you question me about each of these things?',
          apparatus: 'λόγον A B : λόγος V',
          context: 'Epic poetry, oral tradition'
        }
      ]
    }
  };

  const availableConcepts = Object.keys(concepts);
  const currentData = concepts[selectedConcept as keyof typeof concepts];

  const getNodeX = (index: number, total: number) => {
    const timelineWidth = 1000;
    const margin = 100;
    const availableWidth = timelineWidth - (2 * margin);
    return margin + (index * (availableWidth / (total - 1)));
  };

  const getWordAnalysis = (word: string) => {
    const analyses: Record<string, any> = {
      'ἀνδρὸς': {
        lemma: 'ἀνήρ',
        form: 'gen. sg.',
        meaning: 'of a man',
        morphology: 'masculine noun, genitive singular'
      },
      'ἀρετήν': {
        lemma: 'ἀρετή',
        form: 'acc. sg.',
        meaning: 'excellence, virtue',
        morphology: 'feminine noun, accusative singular'
      },
      'τε': {
        lemma: 'τε',
        form: 'particle',
        meaning: 'and, both',
        morphology: 'enclitic particle'
      },
      'καὶ': {
        lemma: 'καί',
        form: 'conjunction',
        meaning: 'and, also',
        morphology: 'coordinating conjunction'
      },
      'εὐκλείην': {
        lemma: 'εὐκλεία',
        form: 'acc. sg.',
        meaning: 'good fame, glory',
        morphology: 'feminine noun, accusative singular'
      }
    };
    return analyses[word] || { lemma: word, form: 'unknown', meaning: 'unknown', morphology: 'unknown' };
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        borderBottom: '1px solid #1E1E24',
        padding: '1rem 2rem',
        backgroundColor: '#141419'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/" style={{ 
              color: '#C9A227', 
              textDecoration: 'none', 
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              LOGOS
            </Link>
            <div style={{ color: '#6B7280', fontSize: '1.25rem' }}>|</div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              color: '#F5F4F2'
            }}>
              ΧΡΟΝΟΣ • Diachronic Analysis
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => setShowApparatus(!showApparatus)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: showApparatus ? '#C9A227' : 'transparent',
                border: `1px solid ${showApparatus ? '#C9A227' : '#6B7280'}`,
                borderRadius: '0.5rem',
                color: showApparatus ? '#0D0D0F' : '#F5F4F2',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Critical Apparatus
            </button>
            <button
              onClick={() => setEmbeddingView(!embeddingView)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: embeddingView ? '#C9A227' : 'transparent',
                border: `1px solid ${embeddingView ? '#C9A227' : '#6B7280'}`,
                borderRadius: '0.5rem',
                color: embeddingView ? '#0D0D0F' : '#F5F4F2',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Word Embeddings
            </button>
            <button
              onClick={() => setShowParadigm(!showParadigm)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: showParadigm ? '#C9A227' : 'transparent',
                border: `1px solid ${showParadigm ? '#C9A227' : '#6B7280'}`,
                borderRadius: '0.5rem',
                color: showParadigm ? '#0D0D0F' : '#F5F4F2',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Paradigm
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '2rem' }}>
        {/* Concept Selector */}
        <div style={{ marginBottom: '2rem', position: 'relative' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#C9A227',
              margin: '0 0 0.5rem 0'
            }}>
              Select Concept for Diachronic Analysis
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem', margin: 0 }}>
              Explore semantic evolution across historical periods with manuscript evidence
            </p>
          </div>
          
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                padding: '1rem 1.5rem',
                backgroundColor: '#1E1E24',
                border: '1px solid #6B7280',
                borderRadius: '0.75rem',
                color: '#F5F4F2',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                minWidth: '300px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C9A227';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#6B7280';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                <span style={{ 
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#3B82F6',
                  borderRadius: '50%'
                }}>
                </span>
                <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>Α</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedConcept}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                    {currentData.transliteration} • {currentData.modern}
                  </div>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>

            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#1E1E24',
                border: '1px solid #6B7280',
                borderRadius: '0.75rem',
                marginTop: '0.5rem',
                zIndex: 1000,
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
              }}>
                {availableConcepts.map((concept) => (
                  <button
                    key={concept}
                    onClick={() => {
                      setSelectedConcept(concept);
                      setShowDropdown(false);
                      setExpandedNode(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '1rem 1.5rem',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: concept === selectedConcept ? '#C9A227' : '#F5F4F2',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'all 0.2s ease',
                      borderBottom: availableConcepts.indexOf(concept) < availableConcepts.length - 1 ? '1px solid #141419' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (concept !== selectedConcept) {
                        e.currentTarget.style.backgroundColor = '#141419';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span style={{ 
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#3B82F6',
                      borderRadius: '50%'
                    }}>
                    </span>
                    <span style={{ color: '#3B82F6', fontWeight: 'bold', fontSize: '0.8rem' }}>Α</span>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{concept}</div>
                      <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                        {concepts[concept as keyof typeof concepts].transliteration} • {concepts[concept as keyof typeof concepts].modern}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LSJ Integration */}
        <div style={{
          backgroundColor: '#1E1E24',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid #C9A227'
        }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            color: '#C9A227',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}>
            LSJ Lexicon Entry
          </h3>
          <p style={{ 
            color: '#F5F4F2', 
            margin: 0, 
            lineHeight: '1.6',
            fontStyle: 'italic'
          }}>
            {currentData.lsj}
          </p>
        </div>

        {/* Paradigm Table */}
        {showParadigm && (
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: '1px solid #3B82F6'
          }}>
            <h3 style={{ 
              margin: '0 0 1rem 0', 
              color: '#3B82F6',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              Morphological Paradigm
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem'
            }}>
              <div>
                <h4 style={{ color: '#C9A227', margin: '0 0 0.5rem 0' }}>Singular</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: '#9CA3AF' }}>Nom.</span>
                  <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>{currentData.paradigm.nom_sg}</span>
                  <span style={{ color: '#9CA3AF' }}>Gen.</span>
                  <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>{currentData.paradigm.gen_sg}</span>
                  <span style={{ color: '#9CA3AF' }}>Dat.</span>
                  <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>{currentData.paradigm.dat_sg}</span>
                  <span style={{ color: '#9CA3AF' }}>Acc.</span>
                  <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>{currentData.paradigm.acc_sg}</span>
                </div>
              </div>
              <div>
                <h4 style={{ color: '#C9A227', margin: '0 0 0.5rem 0' }}>Plural</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: '#9CA3AF' }}>Nom.</span>
                  <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>{currentData.paradigm.nom_pl}</span>
                  <span style={{ color: '#9CA3AF' }}>Gen.</span>
                  <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>{currentData.paradigm.gen_pl}</span>
                  <span style={{ color: '#9CA3AF' }}>Dat.</span>
                  <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>{currentData.paradigm.dat_pl}</span>
                  <span style={{ color: '#9CA3AF' }}>Acc.</span>
                  <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>{currentData.paradigm.acc_pl}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Word Embeddings Visualization */}
        {embeddingView && (
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: '1px solid #7C3AED'
          }}>
            <h3 style={{ 
              margin: '0 0 1rem 0', 
              color: '#7C3AED',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              Semantic Word Embeddings
            </h3>
            <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#141419', borderRadius: '0.5rem' }}>
              <svg width="100%" height="300" style={{ overflow: 'visible' }}>
                {/* Central concept */}
                <circle
                  cx="200"
                  cy="150"
                  r="20"
                  fill="#C9A227"
                  stroke="#F5F4F2"
                  strokeWidth="2"
                />
                <text
                  x="200"
                  y="155"
                  textAnchor="middle"
                  fill="#0D0D0F"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {selectedConcept}
                </text>

                {/* Related words */}
                {currentData.embeddings.map((embedding, index) => (
                  <g key={index}>
                    <line
                      x1="200"
                      y1="150"
                      x2={embedding.x}
                      y2={embedding.y}
                      stroke="#6B7280"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                    <circle
                      cx={embedding.x}
                      cy={embedding.y}
                      r={8 + (embedding.similarity * 8)}
                      fill="#7C3AED"
                      stroke={hoveredEmbedding === embedding.word ? "#C9A227" : "#F5F4F2"}
                      strokeWidth={hoveredEmbedding === embedding.word ? "2" : "1"}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredEmbedding(embedding.word)}
                      onMouseLeave={() => setHoveredEmbedding(null)}
                    />
                    <text
                      x={embedding.x}
                      y={embedding.y - 20}
                      textAnchor="middle"
                      fill="#3B82F6"
                      fontSize="11"
                      fontWeight="bold"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredEmbedding(embedding.word)}
                      onMouseLeave={() => setHoveredEmbedding(null)}
                    >
                      {embedding.word}
                    </text>
                    {hoveredEmbedding === embedding.word && (
                      <text
                        x={embedding.x}
                        y={embedding.y + 25}
                        textAnchor="middle"
                        fill="#9CA3AF"
                        fontSize="10"
                      >
                        {(embedding.similarity * 100).toFixed(1)}% similarity
                      </text>
                    )}
                  </g>
                ))}
              </svg>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div ref={timelineRef} style={{
          backgroundColor: '#1E1E24',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ 
            margin: '0 0 2rem 0', 
            color: '#C9A227',
            fontSize: '1.25rem',
            fontWeight: 'bold'
          }}>
            Diachronic Evolution Timeline
          </h3>

          <div style={{ position: 'relative', width: '100%', height: '200px', marginBottom: '2rem' }}>
            <svg width="100%" height="200" style={{ overflow: 'visible' }}>
              {/* Timeline line */}
              <line x1="100" y1="100" x2="1000" y2="100" stroke="#6B7280" strokeWidth="2"/>
              
              {/* Era nodes */}
              {currentData.data.map((era, index) => {
                const x = getNodeX(index, currentData.data.length);
                const isHovered = hoveredNode === index;
                const isExpanded = expandedNode === index;
                
                return (
                  <g key={index}>
                    {/* Connection line to timeline */}
                