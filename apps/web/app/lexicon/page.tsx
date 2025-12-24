'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Lexicon() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);
  const [showEtymology, setShowEtymology] = useState(true);
  const [showParadigm, setShowParadigm] = useState(false);
  const [activeTab, setActiveTab] = useState('definition');
  const [showSemanticDrift, setShowSemanticDrift] = useState(false);

  const lexiconEntries = [
    {
      id: 1,
      headword: 'λόγος',
      polytonic: 'λόγος',
      pronunciation: 'LOG-os',
      pos: 'noun, masculine',
      lsj: '1056',
      definitions: [
        { sense: 'I', definition: 'that which is said or spoken, word, saying', citations: ['Hom. Il. 1.73', 'Hdt. 1.8'] },
        { sense: 'II', definition: 'account, explanation, reason', citations: ['Pl. Ap. 20c', 'Arist. Metaph. 981a'] },
        { sense: 'III', definition: 'ratio, proportion', citations: ['Eucl. Elem. 6.1'] },
        { sense: 'IV', definition: 'the Word, divine reason (in philosophy)', citations: ['Heraclit. fr. 1', 'Jo. 1.1'] }
      ],
      etymology: {
        root: '√leg-',
        cognates: ['Latin: legere', 'English: logic, -logy', 'Gothic: lisan'],
        development: 'PIE *leǵ- "to collect, gather" → Greek λέγω "to speak" → λόγος "word, reason"',
        semanticShift: 'concrete speech → abstract reason → divine principle'
      },
      paradigm: [
        { case: 'Nom.', singular: 'λόγος', plural: 'λόγοι' },
        { case: 'Gen.', singular: 'λόγου', plural: 'λόγων' },
        { case: 'Dat.', singular: 'λόγῳ', plural: 'λόγοις' },
        { case: 'Acc.', singular: 'λόγον', plural: 'λόγους' },
        { case: 'Voc.', singular: 'λόγε', plural: 'λόγοι' }
      ],
      manuscripts: [
        { ms: 'P.Oxy. 1', variant: 'λογος', note: 'without accent', date: '3rd c. CE' },
        { ms: 'Cod. Vat.', variant: 'λόγος', note: 'standard form', date: '4th c. CE' },
        { ms: 'P.Berol.', variant: 'λωγος', note: 'iotacism', date: '5th c. CE' }
      ],
      frequency: 0.89,
      era: 'Classical',
      semanticDrift: [
        { period: 'Archaic', meaning: 'speech, utterance', strength: 0.9 },
        { period: 'Classical', meaning: 'reason, argument', strength: 0.8 },
        { period: 'Hellenistic', meaning: 'divine principle', strength: 0.7 },
        { period: 'Imperial', meaning: 'Christian Word', strength: 0.6 }
      ],
      wordEmbeddings: [
        { word: 'ῥῆμα', similarity: 0.85, meaning: 'utterance' },
        { word: 'νοῦς', similarity: 0.78, meaning: 'mind' },
        { word: 'σοφία', similarity: 0.72, meaning: 'wisdom' },
        { word: 'ἐπιστήμη', similarity: 0.69, meaning: 'knowledge' }
      ]
    },
    {
      id: 2,
      headword: 'σοφία',
      polytonic: 'σοφία',
      pronunciation: 'so-PHI-a',
      pos: 'noun, feminine',
      lsj: '1621',
      definitions: [
        { sense: 'I', definition: 'skill, cleverness in handicraft', citations: ['Hom. Il. 15.412', 'Hes. Op. 430'] },
        { sense: 'II', definition: 'wisdom, learning', citations: ['Sol. fr. 13', 'Hdt. 1.30'] },
        { sense: 'III', definition: 'philosophy, theoretical wisdom', citations: ['Pl. Ap. 20d', 'Arist. EN 1141a'] }
      ],
      etymology: {
        root: '√soph-',
        cognates: ['σοφός (wise)', 'σοφιστής (sophist)', 'φιλοσοφία (philosophy)'],
        development: 'From σοφός "skilled, wise" + abstract suffix -ία',
        semanticShift: 'technical skill → intellectual wisdom → philosophical knowledge'
      },
      paradigm: [
        { case: 'Nom.', singular: 'σοφία', plural: 'σοφίαι' },
        { case: 'Gen.', singular: 'σοφίας', plural: 'σοφιῶν' },
        { case: 'Dat.', singular: 'σοφίᾳ', plural: 'σοφίαις' },
        { case: 'Acc.', singular: 'σοφίαν', plural: 'σοφίας' },
        { case: 'Voc.', singular: 'σοφία', plural: 'σοφίαι' }
      ],
      manuscripts: [
        { ms: 'P.Berol.', variant: 'σοφια', note: 'iotacism', date: '3rd c. CE' },
        { ms: 'Cod. Alex.', variant: 'σοφία', note: 'standard', date: '5th c. CE' }
      ],
      frequency: 0.65,
      era: 'Classical',
      semanticDrift: [
        { period: 'Archaic', meaning: 'technical skill', strength: 0.9 },
        { period: 'Classical', meaning: 'wisdom', strength: 0.85 },
        { period: 'Hellenistic', meaning: 'philosophy', strength: 0.75 }
      ],
      wordEmbeddings: [
        { word: 'φρόνησις', similarity: 0.82, meaning: 'practical wisdom' },
        { word: 'ἐπιστήμη', similarity: 0.79, meaning: 'knowledge' },
        { word: 'τέχνη', similarity: 0.71, meaning: 'skill' }
      ]
    },
    {
      id: 3,
      headword: 'ἀρετή',
      polytonic: 'ἀρετή',
      pronunciation: 'a-re-TAY',
      pos: 'noun, feminine',
      lsj: '234',
      definitions: [
        { sense: 'I', definition: 'excellence of any kind', citations: ['Hom. Il. 20.411'] },
        { sense: 'II', definition: 'moral virtue', citations: ['Pl. Men. 70a', 'Arist. EN 1103a'] },
        { sense: 'III', definition: 'valour, prowess', citations: ['Thuc. 2.40'] }
      ],
      etymology: {
        root: '√ar-',
        cognates: ['ἄριστος (best)', 'ἀρέσκω (to please)', 'ἁρμόζω (to fit)'],
        development: 'From ἄρω "to fit" → excellence, virtue',
        semanticShift: 'physical excellence → moral excellence → philosophical virtue'
      },
      paradigm: [
        { case: 'Nom.', singular: 'ἀρετή', plural: 'ἀρεταί' },
        { case: 'Gen.', singular: 'ἀρετῆς', plural: 'ἀρετῶν' },
        { case: 'Dat.', singular: 'ἀρετῇ', plural: 'ἀρεταῖς' },
        { case: 'Acc.', singular: 'ἀρετήν', plural: 'ἀρετάς' },
        { case: 'Voc.', singular: 'ἀρετή', plural: 'ἀρεταί' }
      ],
      manuscripts: [
        { ms: 'P.Oxy. 15', variant: 'αρετη', note: 'no breathings', date: '2nd c. CE' },
        { ms: 'Cod. Sinait.', variant: 'ἀρετή', note: 'full diacritics', date: '4th c. CE' }
      ],
      frequency: 0.72,
      era: 'Classical',
      semanticDrift: [
        { period: 'Archaic', meaning: 'physical excellence', strength: 0.9 },
        { period: 'Classical', meaning: 'moral virtue', strength: 0.88 },
        { period: 'Hellenistic', meaning: 'philosophical virtue', strength: 0.75 }
      ],
      wordEmbeddings: [
        { word: 'κακία', similarity: 0.85, meaning: 'vice (opposite)' },
        { word: 'ἀγαθόν', similarity: 0.78, meaning: 'good' },
        { word: 'καλόν', similarity: 0.74, meaning: 'noble' }
      ]
    }
  ];

  const filteredEntries = lexiconEntries.filter(entry =>
    entry.headword.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.polytonic.includes(searchQuery) ||
    entry.definitions.some(def => def.definition.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const WordEmbeddingsViz = ({ embeddings }) => (
    <div style={{ padding: '16px', backgroundColor: '#1E1E24', borderRadius: '8px', marginTop: '16px' }}>
      <h4 style={{ color: '#F5F4F2', marginBottom: '12px', fontSize: '14px' }}>Semantic Neighbors</h4>
      <svg width="100%" height="200" style={{ overflow: 'visible' }}>
        {embeddings.map((word, index) => {
          const angle = (index / embeddings.length) * 2 * Math.PI;
          const radius = 60;
          const x = 150 + Math.cos(angle) * radius * word.similarity;
          const y = 100 + Math.sin(angle) * radius * word.similarity;
          
          return (
            <g key={word.word}>
              <line
                x1="150"
                y1="100"
                x2={x}
                y2={y}
                stroke="#C9A227"
                strokeWidth="1"
                opacity="0.5"
              />
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="#3B82F6"
                opacity="0.8"
              />
              <text
                x={x}
                y={y - 8}
                fill="#F5F4F2"
                fontSize="12"
                textAnchor="middle"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {word.word}
              </text>
              <text
                x={x}
                y={y + 16}
                fill="#9CA3AF"
                fontSize="10"
                textAnchor="middle"
              >
                {word.meaning}
              </text>
            </g>
          );
        })}
        <circle cx="150" cy="100" r="6" fill="#C9A227" />
        <text x="150" y="130" fill="#F5F4F2" fontSize="12" textAnchor="middle">Target Word</text>
      </svg>
    </div>
  );

  const SemanticDriftChart = ({ driftData }) => (
    <div style={{ padding: '16px', backgroundColor: '#1E1E24', borderRadius: '8px', marginTop: '16px' }}>
      <h4 style={{ color: '#F5F4F2', marginBottom: '12px', fontSize: '14px' }}>Semantic Drift Over Time</h4>
      <svg width="100%" height="120">
        {driftData.map((point, index) => {
          const x = 50 + (index * 100);
          const y = 80 - (point.strength * 60);
          const nextPoint = driftData[index + 1];
          
          return (
            <g key={point.period}>
              {nextPoint && (
                <line
                  x1={x}
                  y1={y}
                  x2={50 + ((index + 1) * 100)}
                  y2={80 - (nextPoint.strength * 60)}
                  stroke="#C9A227"
                  strokeWidth="2"
                />
              )}
              <circle cx={x} cy={y} r="4" fill="#3B82F6" />
              <text x={x} y="105" fill="#9CA3AF" fontSize="10" textAnchor="middle">
                {point.period}
              </text>
              <text x={x} y={y - 8} fill="#F5F4F2" fontSize="10" textAnchor="middle">
                {point.meaning}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );

  const playAudio = (word) => {
    // Simulate audio playback
    console.log(`Playing audio for: ${word}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#141419', 
        padding: '16px 24px', 
        borderBottom: '1px solid #1E1E24',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/" style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none',
            fontFamily: 'Georgia, serif'
          }}>
            ΛΟΓΟΣ
          </Link>
          
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/texts" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>
              Texts
            </Link>
            <Link href="/lexicon" style={{ color: '#C9A227', textDecoration: 'none' }}>
              Lexicon
            </Link>
            <Link href="/analysis" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>
              Analysis
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
            Greek-English Lexicon
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '16px' }}>
            Comprehensive lexicon with LSJ integration, manuscript variants, and semantic analysis
          </p>
        </div>

        {/* Search and Controls */}
        <div style={{ 
          backgroundColor: '#1E1E24', 
          padding: '24px', 
          borderRadius: '12px', 
          marginBottom: '24px',
          border: '1px solid #141419'
        }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by headword, definition, or LSJ number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: '1',
                minWidth: '300px',
                padding: '12px 16px',
                backgroundColor: '#141419',
                border: '1px solid #6B7280',
                borderRadius: '8px',
                color: '#F5F4F2',
                fontSize: '14px'
              }}
            />
            <button
              onClick={() => setShowEtymology(!showEtymology)}
              style={{
                padding: '12px 16px',
                backgroundColor: showEtymology ? '#C9A227' : '#141419',
                color: showEtymology ? '#0D0D0F' : '#F5F4F2',
                border: '1px solid #6B7280',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Etymology
            </button>
            <button
              onClick={() => setShowParadigm(!showParadigm)}
              style={{
                padding: '12px 16px',
                backgroundColor: showParadigm ? '#C9A227' : '#141419',
                color: showParadigm ? '#0D0D0F' : '#F5F4F2',
                border: '1px solid #6B7280',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Paradigms
            </button>
            <button
              onClick={() => setShowSemanticDrift(!showSemanticDrift)}
              style={{
                padding: '12px 16px',
                backgroundColor: showSemanticDrift ? '#C9A227' : '#141419',
                color: showSemanticDrift ? '#0D0D0F' : '#F5F4F2',
                border: '1px solid #6B7280',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Semantic Analysis
            </button>
          </div>
          
          <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
            {filteredEntries.length} entries found • LSJ integration active
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedWord ? '1fr 1fr' : '1fr', gap: '24px' }}>
          {/* Entry List */}
          <div>
            {filteredEntries.map(entry => (
              <div
                key={entry.id}
                style={{
                  backgroundColor: '#1E1E24',
                  border: selectedWord?.id === entry.id ? '2px solid #C9A227' : '1px solid #141419',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setSelectedWord(selectedWord?.id === entry.id ? null : entry)}
                onMouseEnter={(e) => {
                  if (selectedWord?.id !== entry.id) {
                    e.target.style.borderColor = '#6B7280';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedWord?.id !== entry.id) {
                    e.target.style.borderColor = '#141419';
                  }
                }}
              >
                {/* Headword and Basic Info */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '12px' }}>
                  <div>
                    <h3 style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold', 
                      marginBottom: '4px',
                      fontFamily: 'Georgia, serif',
                      color: '#F5F4F2'
                    }}>
                      {entry.polytonic}
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
                      <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>Α</span>
                      <span style={{ color: '#9CA3AF' }}>/{entry.pronunciation}/</span>
                      <span style={{ color: '#6B7280' }}>{entry.pos}</span>
                      <span style={{ color: '#C9A227', fontWeight: 'bold' }}>LSJ {entry.lsj}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio(entry.polytonic);
                    }}
                    style={{
                      padding: '8px',
                      backgroundColor: '#141419',
                      border: '1px solid #6B7280',
                      borderRadius: '6px',
                      color: '#9CA3AF',
                      cursor: 'pointer',
                      marginLeft: 'auto'
                    }}
                  >
                    🔊
                  </button>
                </div>

                {/* Quick Definitions */}
                <div style={{ marginBottom: '12px' }}>
                  {entry.definitions.slice(0, 2).map(def => (
                    <div key={def.sense} style={{ marginBottom: '6px' }}>
                      <span style={{ 
                        color: '#C9A227', 
                        fontWeight: 'bold', 
                        marginRight: '8px',
                        fontSize: '14px'
                      }}>
                        {def.sense}.
                      </span>
                      <span style={{ color: '#F5F4F2', fontSize: '14px' }}>{def.definition}</span>
                    </div>
                  ))}
                  {entry.definitions.length > 2 && (
                    <div style={{ color: '#6B7280', fontSize: '12px', fontStyle: 'italic' }}>
                      +{entry.definitions.length - 2} more senses
                    </div>
                  )}
                </div>

                {/* Frequency Bar */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Frequency</span>
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{(entry.frequency * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '4px', 
                    backgroundColor: '#141419', 
                    borderRadius: '2px' 
                  }}>
                    <div style={{
                      width: `${entry.frequency * 100}%`,
                      height: '100%',
                      backgroundColor: '#C9A227',
                      borderRadius: '2px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>

                {/* Era Tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: '#3B82F6',
                    color: '#F5F4F2',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {entry.era}
                  </span>
                  
                  {entry.manuscripts.length > 0 && (
                    <span style={{ color: '#6B7280', fontSize: '12px' }}>
                      {entry.manuscripts.length} manuscript variants
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed View */}
          {selectedWord && (
            <div style={{
              backgroundColor: '#1E1E24',
              border: '1px solid #141419',
              borderRadius: '12px',
              padding: '24px',
              height: 'fit-content',
              position: 'sticky',
              top: '100px'
            }}>
              {/* Tabs */}
              <div style={{ 
                display: 'flex', 
                borderBottom: '1px solid #141419', 
                marginBottom: '20px' 
              }}>
                {['definition', 'etymology', 'paradigm', 'manuscripts', 'analysis'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: activeTab === tab ? '#C9A227' : '#9CA3AF',
                      borderBottom: activeTab === tab ? '2px solid #C9A227' : '2px solid transparent',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Header */}
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h2 style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  marginBottom: '8px',
                  fontFamily: 'Georgia, serif'
                }}>
                  {selectedWord.polytonic}
                </h2>
                <div style={{ color: '#9CA3AF', fontSize: '16px' }}>
                  /{selectedWord.pronunciation}/ • {selectedWord.pos} • LSJ {selectedWord.lsj}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'definition' && (
                <div>
                  {selectedWord.definitions.map(def => (
                    <div key={def.sense} style={{ marginBottom: '16px' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ 
                          color: '#C9A227', 
                          fontWeight: 'bold', 
                          marginRight: '8px',
                          fontSize: '16px'
                        }}>
                          {def.sense}.
                        </span>
                        <span style={{ color: '#F5F4F2', fontSize: '16px' }}>{def.definition}</span>
                      </div>
                      <div style={{ marginLeft: '24px' }}>
                        {def.citations.map(citation => (
                          <span
                            key={citation}
                            style={{
                              display: 'inline-block',
                              padding: '2px 6px',
                              backgroundColor: '#141419',
                              color: '#9CA3AF',
                              fontSize: '12px',
                              borderRadius: '3px',
                              marginRight: '6px',
                              marginBottom: '4px'
                            }}
                          >
                            {citation}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'etymology' && showEtymology && (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ color: '#C9A227', marginBottom: '8px' }}>Root</h4>
                    <p style={{ color: '#F5F4F2', fontFamily: 'monospace' }}>{selectedWord.etymology.root}</p>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ color: '#C9A227', marginBottom: '8px' }}>Development</h4>
                    <p style={{ color: '#F5F4F2', fontSize: '14px' }}>{selectedWord.etymology.development}</p>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ color: '#C9A227', marginBottom: '8px' }}>Cognates</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {selectedWord.etymology.cognates.map(cognate => (
                        <span
                          key={cognate}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#141419',
                            color: '#9CA3AF',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                        >
                          {cognate}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ color: '#C9A227', marginBottom: '8px' }}>Semantic Shift</h4>
                    <p style={{ color: '#F5F4F2', fontSize: '14px', fontStyle: 'italic' }}>
                      {selectedWord.etymology.semanticShift}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'paradigm' && showParadigm && (
                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #141419' }}>
                        <th style={{ padding: '8px', textAlign: 'left', color: '#C9A227' }}>Case</th>
                        <th style={{ padding: '8px', textAlign: 'left', color: '#