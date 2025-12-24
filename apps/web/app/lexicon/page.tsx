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
        { period: 'Hellenistic', meaning: 'philosophical virtue', strength: 0.75 }
      ],
      wordEmbeddings: [
        { word: 'κακία', similarity: 0.88, meaning: 'vice (antonym)' },
        { word: 'σωφροσύνη', similarity: 0.75, meaning: 'temperance' },
        { word: 'δικαιοσύνη', similarity: 0.72, meaning: 'justice' }
      ]
    }
  ];

  const filteredEntries = lexiconEntries.filter(entry =>
    entry.headword.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.pronunciation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.definitions.some(def => def.definition.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const eraColors = {
    'Archaic': '#D97706',
    'Classical': '#F59E0B',
    'Hellenistic': '#3B82F6',
    'Imperial': '#DC2626',
    'Late Antique': '#7C3AED',
    'Byzantine': '#059669'
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
        background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
        borderBottom: '1px solid rgba(201, 162, 39, 0.2)',
        padding: '2rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/" style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #C9A227 0%, #F59E0B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none'
            }}>
              ΛΟΓΟΣ
            </Link>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                backgroundColor: '#3B82F6',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                Α
              </div>
              <span style={{ color: '#9CA3AF', fontSize: '1.1rem' }}>Advanced Greek Lexicon</span>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/texts" style={{
              color: '#9CA3AF',
              textDecoration: 'none',
              transition: 'color 0.3s',
              fontSize: '0.95rem',
              fontWeight: '500'
            }}>
              Texts
            </Link>
            <Link href="/grammar" style={{
              color: '#9CA3AF',
              textDecoration: 'none',
              transition: 'color 0.3s',
              fontSize: '0.95rem',
              fontWeight: '500'
            }}>
              Grammar
            </Link>
            <Link href="/lexicon" style={{
              color: '#C9A227',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: '600'
            }}>
              Lexicon
            </Link>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Search & Controls */}
        <div style={{
          backgroundColor: '#1E1E24',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid rgba(201, 162, 39, 0.2)',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Search lexicon entries... (try λόγος, σοφία, or ἀρετή)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 3rem 1rem 1rem',
                  backgroundColor: '#141419',
                  border: '2px solid rgba(201, 162, 39, 0.3)',
                  borderRadius: '0.75rem',
                  color: '#F5F4F2',
                  fontSize: '1.1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(201, 162, 39, 0.3)'}
              />
              <svg style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1.25rem',
                height: '1.25rem',
                color: '#9CA3AF'
              }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <button
              onClick={() => setShowSemanticDrift(!showSemanticDrift)}
              style={{
                padding: '1rem 1.5rem',
                backgroundColor: showSemanticDrift ? '#C9A227' : '#141419',
                border: '2px solid #C9A227',
                borderRadius: '0.75rem',
                color: showSemanticDrift ? '#0D0D0F' : '#C9A227',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap'
              }}
            >
              Semantic Analysis
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="etymology"
                checked={showEtymology}
                onChange={(e) => setShowEtymology(e.target.checked)}
                style={{ width: '1.2rem', height: '1.2rem' }}
              />
              <label htmlFor="etymology" style={{ color: '#9CA3AF', cursor: 'pointer' }}>
                Show Etymology
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="paradigm"
                checked={showParadigm}
                onChange={(e) => setShowParadigm(e.target.checked)}
                style={{ width: '1.2rem', height: '1.2rem' }}
              />
              <label htmlFor="paradigm" style={{ color: '#9CA3AF', cursor: 'pointer' }}>
                Show Paradigms
              </label>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedWord ? '1fr 1fr' : '1fr', gap: '2rem' }}>
          {/* Entries List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelectedWord(entry)}
                style={{
                  backgroundColor: '#1E1E24',
                  border: `2px solid ${selectedWord?.id === entry.id ? '#C9A227' : 'rgba(59, 130, 246, 0.3)'}`,
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
                  transform: selectedWord?.id === entry.id ? 'scale(1.02)' : 'scale(1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (selectedWord?.id !== entry.id) {
                    e.currentTarget.style.borderColor = '#3B82F6';
                    e.currentTarget.style.transform = 'scale(1.01)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedWord?.id !== entry.id) {
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                {/* Era indicator */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: eraColors[entry.era],
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {entry.era}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem' }}>
                  <h3 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#3B82F6',
                    margin: 0,
                    fontFamily: 'serif'
                  }}>
                    {entry.headword}
                  </h3>
                  <span style={{ color: '#9CA3AF', fontSize: '1rem' }}>
                    [{entry.pronunciation}]
                  </span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <span style={{
                    backgroundColor: 'rgba(201, 162, 39, 0.2)',
                    color: '#C9A227',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}>
                    {entry.pos}
                  </span>
                  <span style={{
                    marginLeft: '0.75rem',
                    color: '#6B7280',
                    fontSize: '0.85rem'
                  }}>
                    LSJ {entry.lsj}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {entry.definitions.slice(0, 2).map((def, idx) => (
                    <div key={idx}>
                      <span style={{ color: '#C9A227', fontWeight: 'bold', marginRight: '0.5rem' }}>
                        {def.sense}.
                      </span>
                      <span style={{ color: '#F5F4F2' }}>{def.definition}</span>
                      {def.citations.length > 0 && (
                        <div style={{ marginTop: '0.25rem', paddingLeft: '1rem' }}>
                          <span style={{ color: '#6B7280', fontSize: '0.85rem' }}>
                            {def.citations.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {entry.definitions.length > 2 && (
                    <span style={{ color: '#9CA3AF', fontSize: '0.9rem', fontStyle: 'italic' }}>
                      +{entry.definitions.length - 2} more definitions
                    </span>
                  )}
                </div>

                {/* Frequency bar */}
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#6B7280', fontSize: '0.85rem' }}>Frequency:</span>
                  <div style={{
                    flex: 1,
                    height: '0.5rem',
                    backgroundColor: '#141419',
                    borderRadius: '0.25rem',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${entry.frequency * 100}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${eraColors[entry.era]}, #C9A227)`,
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>
                    {Math.round(entry.frequency * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed View */}
          {selectedWord && (
            <div style={{
              backgroundColor: '#1E1E24',
              border: '2px solid #C9A227',
              borderRadius: '1rem',
              padding: '2rem',
              height: 'fit-content',
              position: 'sticky',
              top: '2rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#3B82F6',
                    margin: 0,
                    fontFamily: 'serif'
                  }}>
                    {selectedWord.headword}
                  </h2>
                  <p style={{ color: '#9CA3AF', fontSize: '1.1rem', margin: '0.5rem 0' }}>
                    [{selectedWord.pronunciation}] • {selectedWord.pos}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedWord(null)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#141419',
                    border: '1px solid #6B7280',
                    borderRadius: '0.5rem',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#6B7280';
                    e.target.style.color = '#F5F4F2';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#141419';
                    e.target.style.color = '#9CA3AF';
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div style={{ 
                display: 'flex',
                borderBottom: '2px solid #141419',
                marginBottom: '1.5rem',
                gap: '0.5rem'
              }}>
                {['definition', 'etymology', 'paradigm', 'manuscripts'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: activeTab === tab ? '#C9A227' : 'transparent',
                      color: activeTab === tab ? '#0D0D0F' : '#9CA3AF',
                      border: 'none',
                      borderRadius: '0.5rem 0.5rem 0 0',
                      cursor: 'pointer',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      transition: 'all 0.3s'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'definition' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedWord.definitions.map((def, idx) => (
                    <div key={idx} style={{
                      backgroundColor: '#141419',
                      padding: '1.5rem',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(201, 162, 39, 0.2)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <span style={{
                          color: '#C9A227',
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          minWidth: '1.5rem'
                        }}>
                          {def.sense}.
                        </span>
                        <div>
                          <p style={{ color: '#F5F4F2', margin: '0 0 1rem 0', fontSize: '1rem', lineHeight: '1.6' }}>
                            {def.definition}
                          </p>
                          {def.citations.length > 0 && (
                            <div style={{
                              backgroundColor: 'rgba(59, 130, 246, 0.1)',
                              padding: '0.75rem',
                              borderRadius: '0.5rem',
                              borderLeft: '3px solid #3B82F6'
                            }}>
                              <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                                Citations:
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {def.citations.map((citation, citIdx) => (
                                  <span key={citIdx} style={{
                                    backgroundColor: '#3B82F6',
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '1rem',
                                    fontSize: '0.8rem',
                                    fontWeight: '500'
                                  }}>
                                    {citation}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'etymology' && (
                <div style={{
                  backgroundColor: '#141419',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(201, 162, 39, 0.2)'
                }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: '#C9A227', fontSize: '1.1rem', margin: '0 0 0.75rem 0' }}>Root</h4>
                    <span style={{
                      backgroundColor: 'rgba(201, 162, 39, 0.2)',
                      color: '#C9A227',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontFamily: 'monospace',
                      fontSize: '1.1rem'
                    }}>
                      {selectedWord.etymology.root}
                    </span>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: '#C