'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const sampleTexts = [
  {
    urn: 'urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1-1.10',
    title: 'Iliad 1.1-10',
    author: 'Homer',
    language: 'greek',
    era: 'Archaic',
    content: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε, πολλὰς δ᾽ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν ἡρώων, αὐτοὺς δὲ ἑλώρια τεῦχε κύνεσσιν οἰωνοῖσί τε πᾶσι, Διὸς δ᾽ ἐτελείετο βουλή, ἐξ οὗ δὴ τὰ πρῶτα διαστήτην ἐρίσαντε Ἀτρεΐδης τε ἄναξ ἀνδρῶν καὶ δῖος Ἀχιλλεύς.',
    translation: 'Sing, goddess, the rage of Peleus son Achilles, the destructive rage that brought countless woes upon the Achaeans, and sent many mighty souls of heroes down to Hades, while making their bodies prey for dogs and all birds. Thus the will of Zeus was accomplished, from the time when first they parted in strife—Atreus son, lord of men, and brilliant Achilles.',
    commentary: [
      {
        section: 'Opening Invocation',
        content: 'The opening of the Iliad establishes the central theme of rage (μῆνις) and its consequences. This proem follows the traditional epic formula, invoking the Muse and summarizing the story that follows.'
      },
      {
        section: 'The Concept of μῆνις',
        content: 'μῆνις (mēnis) is not ordinary anger but a cosmic, destructive force that drives the entire narrative. It differs from θυμός (thymos) or χόλος (cholos) in its divine and fateful character.'
      }
    ],
    apparatus: [
      { lemma: 'μῆνιν', note: 'A B T: μῆνιν | vulg.: μένιν' },
      { lemma: 'οὐλομένην', note: 'Zen. et Did.: οὐλομένην | Aristoph.: ὀλομένην' }
    ]
  },
  {
    urn: 'urn:cts:latinLit:phi0690.phi003.perseus-lat1:1.1-1.10',
    title: 'Aeneid 1.1-11',
    author: 'Virgil',
    language: 'latin',
    era: 'Imperial',
    content: 'Arma virumque cano, Troiae qui primus ab oris Italiam, fato profugus, Laviniaque venit litora, multum ille et terris iactatus et alto vi superum saevae memorem Iunonis ob iram; multa quoque et bello passus, dum conderet urbem, inferretque deos Latio, genus unde Latinum, Albanique patres, atque altae moenia Romae.',
    translation: 'I sing of arms and the man, who first from the shores of Troy, exiled by fate, came to Italy and to Lavinian shores—much buffeted he was on sea and land by the will of the gods, on account of the never-forgetting anger of fierce Juno; much too he suffered in war, until he could found a city and bring his gods to Latium; from him are the race of the Latins and Alban fathers and the walls of lofty Rome.',
    commentary: [
      {
        section: 'Homeric Echo',
        content: 'Virgil\'s opening echoes Homer while establishing distinctly Roman themes. The phrase "arma virumque" (arms and the man) signals both epic warfare and individual heroism.'
      }
    ],
    apparatus: [
      { lemma: 'virumque', note: 'MPRγ: virumque | Serv.: virum quoque' }
    ]
  }
]

const wordData = {
  'μῆνιν': {
    word: 'μῆνιν',
    lemma: 'μῆνις',
    partOfSpeech: 'noun (accusative singular feminine)',
    definition: 'wrath, anger; especially divine or cosmic anger',
    etymology: 'From PIE *men- "to think, mind"',
    frequency: 47,
    semanticField: 'emotion',
    cognates: ['Lat. mens', 'Eng. mind'],
    paradigm: {
      'Nom. Sg.': 'μῆνις',
      'Gen. Sg.': 'μήνιδος',
      'Dat. Sg.': 'μήνιδι',
      'Acc. Sg.': 'μῆνιν',
      'Voc. Sg.': 'μῆνι'
    },
    manuscripts: [
      { siglum: 'A', reading: 'μῆνιν', confidence: 'certain' },
      { siglum: 'B', reading: 'μῆνιν', confidence: 'certain' },
      { siglum: 'T', reading: 'μῆνιν', confidence: 'certain' }
    ],
    semanticDrift: [
      { period: 'Archaic', meaning: 'divine wrath', frequency: 0.8 },
      { period: 'Classical', meaning: 'human anger', frequency: 0.6 },
      { period: 'Hellenistic', meaning: 'resentment', frequency: 0.4 },
      { period: 'Byzantine', meaning: 'indignation', frequency: 0.2 }
    ],
    embedding: { x: 0.3, y: 0.7, cluster: 'emotion' }
  },
  'ἄειδε': {
    word: 'ἄειδε',
    lemma: 'ἀείδω',
    partOfSpeech: 'verb (2nd person singular present imperative active)',
    definition: 'sing, chant; celebrate in song',
    frequency: 89,
    semanticField: 'performance',
    paradigm: {
      '1st Sg.': 'ἀείδω',
      '2nd Sg.': 'ἀείδεις',
      '3rd Sg.': 'ἀείδει',
      'Imperative': 'ἄειδε'
    },
    embedding: { x: 0.7, y: 0.3, cluster: 'performance' }
  },
  'arma': {
    word: 'arma',
    lemma: 'arma',
    partOfSpeech: 'noun (neuter plural accusative)',
    definition: 'arms, weapons; warfare, military equipment',
    frequency: 156,
    semanticField: 'warfare',
    paradigm: {
      'Nom. Pl.': 'arma',
      'Gen. Pl.': 'armorum',
      'Dat. Pl.': 'armis',
      'Acc. Pl.': 'arma',
      'Abl. Pl.': 'armis'
    },
    embedding: { x: 0.2, y: 0.8, cluster: 'warfare' }
  },
  'cano': {
    word: 'cano',
    lemma: 'cano',
    partOfSpeech: 'verb (1st person singular present active indicative)',
    definition: 'sing, chant; prophesy; celebrate in verse',
    frequency: 78,
    semanticField: 'performance',
    paradigm: {
      '1st Sg.': 'cano',
      '2nd Sg.': 'canis',
      '3rd Sg.': 'canit',
      'Infinitive': 'canere'
    },
    embedding: { x: 0.8, y: 0.4, cluster: 'performance' }
  }
}

const eraColors = {
  'Archaic': '#D97706',
  'Classical': '#F59E0B',
  'Hellenistic': '#3B82F6',
  'Imperial': '#DC2626',
  'Late Antique': '#7C3AED',
  'Byzantine': '#059669'
}

function ReaderContent() {
  const searchParams = useSearchParams()
  const urn = searchParams.get('urn') || sampleTexts[0].urn
  const currentText = sampleTexts.find(t => t.urn === urn) || sampleTexts[0]
  
  const [showTranslation, setShowTranslation] = useState(false)
  const [showCommentary, setShowCommentary] = useState(false)
  const [showApparatus, setShowApparatus] = useState(false)
  const [selectedWord, setSelectedWord] = useState(null)
  const [showParadigm, setShowParadigm] = useState(false)
  const [showEmbeddings, setShowEmbeddings] = useState(false)
  const [annotationMode, setAnnotationMode] = useState('morphology')

  const handleWordClick = (word) => {
    const cleanWord = word.replace(/[.,;:!?]/g, '')
    const wordInfo = wordData[cleanWord]
    if (wordInfo) {
      setSelectedWord(wordInfo)
    }
  }

  const renderWordEmbeddings = () => {
    const words = Object.values(wordData).filter(w => w.embedding)
    const clusters = [...new Set(words.map(w => w.embedding.cluster))]
    const clusterColors = {
      'emotion': '#DC2626',
      'performance': '#C9A227',
      'warfare': '#7C3AED'
    }

    return (
      <div style={{ backgroundColor: '#1E1E24', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
        <h3 style={{ color: '#F5F4F2', fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>
          Word Embeddings Visualization
        </h3>
        <svg width="400" height="300" style={{ backgroundColor: '#141419', borderRadius: '4px' }}>
          {words.map((word, i) => (
            <g key={i}>
              <circle
                cx={word.embedding.x * 350 + 25}
                cy={word.embedding.y * 250 + 25}
                r="6"
                fill={clusterColors[word.embedding.cluster]}
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.target.style.r = '8'
                  e.target.style.opacity = '0.8'
                }}
                onMouseLeave={(e) => {
                  e.target.style.r = '6'
                  e.target.style.opacity = '1'
                }}
              />
              <text
                x={word.embedding.x * 350 + 35}
                y={word.embedding.y * 250 + 30}
                fill="#9CA3AF"
                fontSize="12"
                style={{ pointerEvents: 'none' }}
              >
                {word.word}
              </text>
            </g>
          ))}
        </svg>
        <div style={{ marginTop: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {clusters.map(cluster => (
            <div key={cluster} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: clusterColors[cluster]
                }}
              />
              <span style={{ color: '#9CA3AF', fontSize: '14px', textTransform: 'capitalize' }}>
                {cluster}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderSemanticDrift = () => {
    if (!selectedWord?.semanticDrift) return null
    
    return (
      <div style={{ marginTop: '16px' }}>
        <h4 style={{ color: '#F5F4F2', fontSize: '16px', marginBottom: '12px' }}>
          Semantic Evolution
        </h4>
        <svg width="300" height="150" style={{ backgroundColor: '#141419', borderRadius: '4px' }}>
          {selectedWord.semanticDrift.map((point, i) => (
            <g key={i}>
              <circle
                cx={50 + i * 50}
                cy={130 - point.frequency * 100}
                r="4"
                fill="#C9A227"
              />
              {i > 0 && (
                <line
                  x1={50 + (i-1) * 50}
                  y1={130 - selectedWord.semanticDrift[i-1].frequency * 100}
                  x2={50 + i * 50}
                  y2={130 - point.frequency * 100}
                  stroke="#C9A227"
                  strokeWidth="2"
                />
              )}
              <text
                x={50 + i * 50}
                y={145}
                fill="#9CA3AF"
                fontSize="10"
                textAnchor="middle"
                transform={`rotate(-45, ${50 + i * 50}, 145)`}
              >
                {point.period}
              </text>
            </g>
          ))}
        </svg>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#1E1E24', 
        borderBottom: '1px solid #141419',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ 
              color: '#C9A227', 
              textDecoration: 'none',
              fontSize: '20px',
              fontWeight: '700'
            }}>
              ΛΟΓΟΣ
            </Link>
            <div style={{
              padding: '4px 8px',
              backgroundColor: currentText.language === 'greek' ? '#3B82F6' : '#DC2626',
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {currentText.language === 'greek' ? 'Α' : 'L'}
            </div>
            <div style={{
              padding: '4px 8px',
              backgroundColor: eraColors[currentText.era],
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {currentText.era}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              style={{
                padding: '8px 16px',
                backgroundColor: showTranslation ? '#C9A227' : '#141419',
                color: showTranslation ? '#0D0D0F' : '#F5F4F2',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              Translation
            </button>
            <button
              onClick={() => setShowCommentary(!showCommentary)}
              style={{
                padding: '8px 16px',
                backgroundColor: showCommentary ? '#C9A227' : '#141419',
                color: showCommentary ? '#0D0D0F' : '#F5F4F2',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              Commentary
            </button>
            <button
              onClick={() => setShowApparatus(!showApparatus)}
              style={{
                padding: '8px 16px',
                backgroundColor: showApparatus ? '#C9A227' : '#141419',
                color: showApparatus ? '#0D0D0F' : '#F5F4F2',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              App. Crit.
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: selectedWord ? '2fr 1fr' : '1fr', gap: '24px' }}>
          {/* Main Text Area */}
          <div>
            {/* Text Header */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                color: '#F5F4F2',
                marginBottom: '8px'
              }}>
                {currentText.title}
              </h1>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ color: '#9CA3AF', fontSize: '16px' }}>{currentText.author}</span>
                <span style={{ color: '#6B7280', fontSize: '14px' }}>{currentText.urn}</span>
              </div>
            </div>

            {/* Annotation Mode Selector */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
              {['morphology', 'syntax', 'semantics'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setAnnotationMode(mode)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: annotationMode === mode ? '#C9A227' : '#141419',
                    color: annotationMode === mode ? '#0D0D0F' : '#9CA3AF',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {mode}
                </button>
              ))}
              <button
                onClick={() => setShowEmbeddings(!showEmbeddings)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: showEmbeddings ? '#C9A227' : '#141419',
                  color: showEmbeddings ? '#0D0D0F' : '#9CA3AF',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Embeddings
              </button>
            </div>

            {/* Primary Text */}
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '8px', 
              padding: '24px',
              marginBottom: '16px',
              lineHeight: '1.8'
            }}>
              <div style={{ 
                fontSize: currentText.language === 'greek' ? '20px' : '18px',
                fontFamily: currentText.language === 'greek' ? 'serif' : 'Georgia, serif'
              }}>
                {currentText.content.split(' ').map((word, index) => {
                  const cleanWord = word.replace(/[.,;:!?]/g, '')
                  const hasData = wordData[cleanWord]
                  
                  return (
                    <span
                      key={index}
                      onClick={() => handleWordClick(word)}
                      style={{
                        cursor: hasData ? 'pointer' : 'default',
                        color: hasData ? '#C9A227' : '#F5F4F2',
                        borderBottom: hasData ? '1px dotted #C9A227' : 'none',
                        padding: '2px',
                        margin: '0 2px',
                        borderRadius: '3px',
                        transition: 'all 0.2s ease',
                        backgroundColor: selectedWord?.word === cleanWord ? 'rgba(201, 162, 39, 0.2)' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (hasData) {
                          e.target.style.backgroundColor = 'rgba(201, 162, 39, 0.1)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (hasData && selectedWord?.word !== cleanWord) {
                          e.target.style.backgroundColor = 'transparent'
                        }
                      }}
                    >
                      {word}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Translation */}
            {showTranslation && (
              <div style={{ 
                backgroundColor: '#1E1E24', 
                borderRadius: '8px', 
                padding: '20px',
                marginBottom: '16px',
                opacity: showTranslation ? 1 : 0,
                transform: showTranslation ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{ color: '#C9A227', fontSize: '16px', marginBottom: '12px', fontWeight: '600' }}>
                  Translation
                </h3>
                <p style={{ 
                  color: '#9CA3AF', 
                  lineHeight: '1.6',
                  fontSize: '16px',
                  fontStyle: 'italic'
                }}>
                  {currentText.translation}
                </p>
              </div>
            )}

            {/* Critical Apparatus */}
            {showApparatus && currentText.apparatus && (
              <div style={{ 
                backgroundColor: '#1E1E24', 
                borderRadius: '8px', 
                padding: '20px',
                marginBottom: '16px',
                opacity: showApparatus ? 1 : 0,
                transform: showApparatus ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{ color: '#C9A227', fontSize: '16px', marginBottom: '12px', fontWeight: '600' }}>
                  Apparatus Criticus
                </h3>
                {currentText.apparatus.map((entry, index) => (
                  <div key={index} style={{ marginBottom: '8px' }}>
                    <span style={{ 
                      color: '#F5F4F2', 
                      fontWeight: '600',
                      fontFamily: currentText.language === 'greek' ? 'serif' : 'Georgia, serif'
                    }}>
                      {entry.lemma}
                    </span>
                    <span style={{ color: '#9CA3AF', marginLeft: '8px', fontSize: '14px' }}>
                      {entry.note}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Commentary */}
            {showCommentary && (
              <div style={{ 
                backgroundColor: '#1E1E24', 
                borderRadius: '8px', 
                padding: '20px',
                opacity: showCommentary ? 1 : 0,
                transform: showCommentary ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{ color: '#C9A227', fontSize: '16px', marginBottom: '16px', fontWeight: '600' }}>
                  Scholarly Commentary
                </h3>
                {currentText.commentary.map((comment, index) => (
                  <div key={index} style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: '#F5F4F2', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      {comment.section}
                    </h4>
                    <p style={{ color: '#9CA3AF', lineHeight: '1.6', fontSize: '14px' }}>
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Word Embeddings Visualization */}
            {showEmbeddings && renderWordEmbeddings()}
          </div>

          {/* Word Analysis Panel */}
          {selectedWord && (
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '8px', 
              padding: '20px',
              height: 'fit-content',
              position: 'sticky',
              top: '100px',
              opacity: selectedWord ? 1 : 0,
              transform: selectedWord ? 'translateX(0)' : 'translateX(20px)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ color: '#C9A227', fontSize: '18px', fontWeight: '600' }}>
                  Lexical Analysis
                </h3>
                <button
                  onClick={() => setSelectedWord(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  fontSize: '24px', 
                  color: '#F5F4F2', 
                  fontWeight: '600',
                  fontFamily: currentText.language === 'greek' ? 'serif' : 'Georgia, serif',
                  marginBottom: '4px'
                }}>
                  {selectedWord.word}
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '8px' }}>
                  lemma: <span style={{ fontStyle: 'italic' }}>{selectedWord.lemma}</span>
                </div>
                <div style={{ color: '#6B7280', fontSize: '12px' }}>
                  {selectedWord.partOfSpeech}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ color: '#F5F4F2', fontSize: '14px', marginBottom: '8px' }}>LSJ Definition</h4>
                <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.5' }}>
                  {selectedWord.definition}
                </p>
              </div>

              {selectedWord.etymology && (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ color: '#F5F4F2', fontSize: '14px', marginBottom: '8px' }}>Etymology</h4>
                  <p style={{ color: '#9CA3AF', fontSize: '13px', fontStyle: 'italic' }}>
                    {selectedWord.etymology}
                  </p>
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ color: '#F5F4F2', fontSize: '14px', marginBottom: '8px' }}>
                  Frequency: <span style={{ color: '#C9A227' }}>{selectedWord.frequency}</span>
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#9CA3AF', fontSize: '13px' }}>Semantic field:</span>
                  <span style={{ 
                    color: '#F5F4F2', 
                    backgroundColor: '#141419',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {selectedWord.semanticField}
                  </span>
                </div>
              </div>

              {/* Paradigm Table */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ color: '#F5F4F2', fontSize: '14px' }}>Morphological Paradigm</h4>
                  <button
                    onClick={() => setShowParadigm(!showParadigm)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#C9A227',
                      cursor: 'pointer',
                      fontSize: '