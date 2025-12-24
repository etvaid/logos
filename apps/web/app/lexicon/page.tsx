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
        { period: 'Classical', meaning: 'moral virtue', strength: 0.85 },
        { period: 'Hellenistic', meaning: 'philosophical virtue', strength: 0.8 }
      ],
      wordEmbeddings: [
        { word: 'κακία', similarity: 0.75, meaning: 'vice (antonym)' },
        { word: 'ἀγαθός', similarity: 0.73, meaning: 'good' },
        { word: 'ἐπιεικής', similarity: 0.69, meaning: 'virtuous' }
      ]
    }
  ];

  const filteredEntries = lexiconEntries.filter(entry =>
    entry.headword.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.pronunciation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.definitions.some(def => def.definition.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getEraColor = (era) => {
    const colors = {
      'Archaic': '#D97706',
      'Classical': '#F59E0B',
      'Hellenistic': '#3B82F6',
      'Imperial': '#DC2626',
      'Late Antique': '#7C3AED',
      'Byzantine': '#059669'
    };
    return colors[era] || '#9CA3AF';
  };

  const renderSemanticDriftChart = (driftData) => {
    const maxStrength = Math.max(...driftData.map(d => d.strength));
    
    return (
      <div style={{ 
        backgroundColor: '#141419', 
        borderRadius: '12px', 
        padding: '24px',
        border: `1px solid ${getEraColor('Classical')}20`
      }}>
        <h4 style={{ 
          color: '#F5F4F2', 
          fontSize: '16px', 
          fontWeight: '600',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 3v18h18" stroke="#C9A227" strokeWidth="2"/>
            <path d="M7 12l4-4 4 4 4-4" stroke="#3B82F6" strokeWidth="2"/>
          </svg>
          Semantic Drift Timeline
        </h4>
        <svg width="100%" height="120" style={{ overflow: 'visible' }}>
          {driftData.map((drift, index) => (
            <g key={drift.period}>
              <rect
                x={index * 120 + 20}
                y={80 - (drift.strength * 60)}
                width={20}
                height={drift.strength * 60}
                fill={getEraColor(drift.period)}
                opacity="0.8"
                rx="2"
              />
              <text
                x={index * 120 + 30}
                y="100"
                fill="#9CA3AF"
                fontSize="10"
                textAnchor="middle"
                transform={`rotate(-45, ${index * 120 + 30}, 100)`}
              >
                {drift.period}
              </text>
              <text
                x={index * 120 + 30}
                y={75 - (drift.strength * 60)}
                fill="#F5F4F2"
                fontSize="9"
                textAnchor="middle"
              >
                {(drift.strength * 100).toFixed(0)}%
              </text>
            </g>
          ))}
        </svg>
        <div style={{ marginTop: '16px' }}>
          {driftData.map((drift, index) => (
            <div key={drift.period} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                backgroundColor: getEraColor(drift.period)
              }} />
              <span style={{ color: '#9CA3AF', fontSize: '14px' }}>
                {drift.period}: {drift.meaning}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWordEmbeddings = (embeddings) => {
    return (
      <div style={{
        backgroundColor: '#141419',
        borderRadius: '12px',
        padding: '24px',
        border: `1px solid ${getEraColor('Classical')}20`
      }}>
        <h4 style={{
          color: '#F5F4F2',
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="#C9A227" strokeWidth="2"/>
            <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="#C9A227" strokeWidth="1"/>
          </svg>
          Semantic Relations
        </h4>
        <div style={{
          display: 'grid',
          gap: '12px'
        }}>
          {embeddings.map((embedding, index) => (
            <div key={embedding.word} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: '#1E1E24',
              borderRadius: '8px',
              border: `1px solid rgba(59, 130, 246, ${embedding.similarity * 0.3})`
            }}>
              <div>
                <span style={{
                  color: '#3B82F6',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  {embedding.word}
                </span>
                <span style={{
                  color: '#9CA3AF',
                  fontSize: '14px',
                  marginLeft: '12px'
                }}>
                  "{embedding.meaning}"
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '60px',
                  height: '4px',
                  backgroundColor: '#1E1E24',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${embedding.similarity * 100}%`,
                    height: '100%',
                    backgroundColor: '#3B82F6'
                  }} />
                </div>
                <span style={{
                  color: '#F5F4F2',
                  fontSize: '12px',
                  fontWeight: '600',
                  minWidth: '40px'
                }}>
                  {(embedding.similarity * 100).toFixed(0)}%
                </span>
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
      color: '#F5F4F2'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
        borderBottom: '1px solid #C9A22720',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: '#F5F4F2'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #C9A227 0%, #F59E0B 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '18px',
                color: '#0D0D0F'
              }}>
                Λ
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700',
                  margin: 0,
                  background: 'linear-gradient(135deg, #C9A227 0%, #F59E0B 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  LOGOS Lexicon
                </h1>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#9CA3AF',
                  margin: 0
                }}>
                  Advanced Greek Dictionary
                </p>
              </div>
            </Link>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#141419',
            borderRadius: '12px',
            padding: '8px 16px',
            border: '1px solid #C9A22720',
            minWidth: '300px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="#9CA3AF" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Greek words..."
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#F5F4F2',
                fontSize: '16px',
                width: '100%'
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '32px 24px',
        display: 'grid',
        gridTemplateColumns: selectedWord ? '400px 1fr' : '1fr',
        gap: '32px'
      }}>
        {/* Lexicon Entries */}
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#F5F4F2',
              margin: 0
            }}>
              Dictionary Entries
            </h2>
            <span style={{
              color: '#9CA3AF',
              fontSize: '14px'
            }}>
              {filteredEntries.length} results
            </span>
          </div>

          {filteredEntries.map((entry, index) => (
            <div
              key={entry.id}
              onClick={() => setSelectedWord(entry)}
              style={{
                backgroundColor: selectedWord?.id === entry.id ? '#1E1E2480' : '#1E1E24',
                borderRadius: '16px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: selectedWord?.id === entry.id 
                  ? `2px solid ${getEraColor(entry.era)}` 
                  : '1px solid #C9A22720',
                transform: selectedWord?.id === entry.id ? 'translateY(-2px)' : 'none',
                boxShadow: selectedWord?.id === entry.id 
                  ? `0 8px 32px ${getEraColor(entry.era)}20` 
                  : 'none'
              }}
              onMouseEnter={(e) => {
                if (selectedWord?.id !== entry.id) {
                  e.currentTarget.style.backgroundColor = '#1E1E2460';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedWord?.id !== entry.id) {
                  e.currentTarget.style.backgroundColor = '#1E1E24';
                  e.currentTarget.style.transform = 'none';
                }
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <h3 style={{ 
                    fontSize: '28px', 
                    fontWeight: '700',
                    color: '#3B82F6',
                    margin: 0,
                    fontFamily: 'serif'
                  }}>
                    {entry.headword}
                  </h3>
                  <div style={{
                    backgroundColor: `${getEraColor(entry.era)}20`,
                    color: getEraColor(entry.era),
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {entry.era}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '6px',
                    backgroundColor: '#141419',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${entry.frequency * 100}%`,
                      height: '100%',
                      backgroundColor: '#C9A227'
                    }} />
                  </div>
                  <span style={{
                    color: '#9CA3AF',
                    fontSize: '12px'
                  }}>
                    {(entry.frequency * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <span style={{ 
                  color: '#9CA3AF',
                  fontSize: '16px',
                  fontStyle: 'italic'
                }}>
                  /{entry.pronunciation}/
                </span>
                <span style={{ 
                  color: '#6B7280',
                  fontSize: '14px',
                  marginLeft: '16px'
                }}>
                  {entry.pos}
                </span>
                <span style={{ 
                  color: '#6B7280',
                  fontSize: '12px',
                  marginLeft: '16px'
                }}>
                  LSJ {entry.lsj}
                </span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                {entry.definitions.slice(0, 2).map((def, idx) => (
                  <div key={idx} style={{ 
                    marginBottom: '8px',
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <span style={{ 
                      color: '#C9A227',
                      fontWeight: '600',
                      fontSize: '14px',
                      minWidth: '20px'
                    }}>
                      {def.sense}.
                    </span>
                    <div>
                      <span style={{ 
                        color: '#F5F4F2',
                        fontSize: '15px',
                        lineHeight: '1.5'
                      }}>
                        {def.definition}
                      </span>
                      <div style={{ 
                        marginTop: '4px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {def.citations.slice(0, 2).map((citation, citIdx) => (
                          <span key={citIdx} style={{
                            color: '#6B7280',
                            fontSize: '12px',
                            backgroundColor: '#14141920',
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            {citation}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {entry.definitions.length > 2 && (
                  <span style={{ 
                    color: '#9CA3AF',
                    fontSize: '14px',
                    fontStyle: 'italic'
                  }}>
                    +{entry.definitions.length - 2} more definitions...
                  </span>
                )}
              </div>

              {selectedWord?.id !== entry.id && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#9CA3AF',
                  fontSize: '14px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Click to explore etymology, paradigms, and semantic analysis
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detailed View */}
        {selectedWord && (
          <div style={{
            position: 'sticky',
            top: '120px',
            height: 'fit-content'
          }}>
            <div style={{
              backgroundColor: '#1E1E24',
              borderRadius: '20px',
              border: `2px solid ${getEraColor(selectedWord.era)}`,
              overflow: 'hidden'
            }}>
              {/* Header */}
              <div style={{
                background: `linear-gradient(135deg, ${getEraColor(selectedWord.era)}20 0%, ${getEraColor(selectedWord.era)}10 100%)`,
                padding: '24px',
                borderBottom: `1px solid ${getEraColor(selectedWord.era)}30`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <h2 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#3B82F6',
                    margin: 0,
                    fontFamily: 'serif'
                  }}>
                    {selectedWord.headword}
                  </h2>
                  <button
                    onClick={() => setSelectedWord(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9CA3AF',
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#14141940';
                      e.currentTarget.style.color = '#F5F4F2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#9CA3AF';
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
                <div style={{
                  display: 'flex