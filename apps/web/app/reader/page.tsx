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

function WordInfo({ word, onClose }) {
  const data = wordData[word];

  if (!data) {
    return (
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        backgroundColor: '#1E1E24', color: '#F5F4F2', padding: '32px', borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 80px rgba(201, 162, 39, 0.1)',
        zIndex: 1000, maxWidth: '400px',
        border: '2px solid rgba(201, 162, 39, 0.2)',
        animation: 'modalFadeIn 0.3s ease-out',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '48px', marginBottom: '16px',
            color: '#C9A227', filter: 'drop-shadow(0 2px 8px rgba(201, 162, 39, 0.3))'
          }}>⚠️</div>
          <p style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#9CA3AF' }}>
            Word data not available
          </p>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#C9A227', color: '#0D0D0F', padding: '12px 24px',
              border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontSize: '16px', fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(201, 162, 39, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#E5B429';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#C9A227';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Close
          </button>
        </div>
        <style jsx>{`
          @keyframes modalFadeIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
      backgroundColor: 'rgba(13, 13, 15, 0.95)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', backdropFilter: 'blur(8px)',
      animation: 'overlayFadeIn 0.3s ease-out'
    }}>
      <div style={{
        backgroundColor: '#1E1E24', borderRadius: '24px', maxWidth: '900px',
        width: '100%', maxHeight: '90vh', overflow: 'auto',
        boxShadow: '0 32px 64px rgba(0, 0, 0, 0.8), 0 0 120px rgba(201, 162, 39, 0.15)',
        border: '2px solid rgba(201, 162, 39, 0.2)',
        position: 'relative',
        animation: 'modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '32px 40px 20px 40px',
          borderBottom: '2px solid rgba(201, 162, 39, 0.2)',
          background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.1), transparent)',
          borderRadius: '22px 22px 0 0',
          position: 'sticky', top: '0', zIndex: 10,
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{
                fontSize: '36px', fontWeight: '700', color: '#F5F4F2',
                marginBottom: '8px', fontFamily: 'serif',
                textShadow: '0 2px 8px rgba(201, 162, 39, 0.3)'
              }}>
                {data.word}
              </div>
              <div style={{
                fontSize: '18px', color: '#C9A227', fontWeight: '600',
                background: 'rgba(201, 162, 39, 0.1)', padding: '6px 12px',
                borderRadius: '20px', display: 'inline-block',
                border: '1px solid rgba(201, 162, 39, 0.3)'
              }}>
                {data.lemma}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent', border: '2px solid rgba(201, 162, 39, 0.3)',
                color: '#C9A227', fontSize: '24px', width: '48px', height: '48px',
                borderRadius: '50%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(201, 162, 39, 0.1)';
                e.target.style.borderColor = '#C9A227';
                e.target.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = 'rgba(201, 162, 39, 0.3)';
                e.target.style.transform = 'rotate(0deg)';
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            {/* Left Column */}
            <div>
              {/* Grammar Info */}
              <div style={{
                backgroundColor: '#141419', borderRadius: '16px', padding: '24px',
                marginBottom: '24px', border: '1px solid rgba(59, 130, 246, 0.2)',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute', top: '-50%', right: '-50%',
                  width: '200%', height: '200%', opacity: '0.03',
                  background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)',
                  pointerEvents: 'none'
                }} />
                <div style={{
                  fontSize: '18px', fontWeight: '600', color: '#3B82F6',
                  marginBottom: '16px', display: 'flex', alignItems: 'center'
                }}>
                  <span style={{
                    backgroundColor: '#3B82F6', color: 'white', fontSize: '12px',
                    padding: '4px 8px', borderRadius: '6px', marginRight: '12px',
                    fontWeight: '700'
                  }}>Α</span>
                  Grammar
                </div>
                <div style={{ color: '#F5F4F2', fontSize: '16px', lineHeight: '1.6' }}>
                  {data.partOfSpeech}
                </div>
              </div>

              {/* Definition */}
              <div style={{
                backgroundColor: '#141419', borderRadius: '16px', padding: '24px',
                marginBottom: '24px', border: '1px solid rgba(201, 162, 39, 0.2)',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute', top: '-50%', right: '-50%',
                  width: '200%', height: '200%', opacity: '0.03',
                  background: 'radial-gradient(circle, #C9A227 0%, transparent 70%)',
                  pointerEvents: 'none'
                }} />
                <div style={{
                  fontSize: '18px', fontWeight: '600', color: '#C9A227',
                  marginBottom: '16px', display: 'flex', alignItems: 'center'
                }}>
                  <span style={{
                    backgroundColor: '#C9A227', color: '#0D0D0F', fontSize: '12px',
                    padding: '4px 8px', borderRadius: '6px', marginRight: '12px',
                    fontWeight: '700'
                  }}>⚡</span>
                  Definition
                </div>
                <div style={{ color: '#F5F4F2', fontSize: '16px', lineHeight: '1.6' }}>
                  {data.definition}
                </div>
              </div>

              {/* Etymology */}
              {data.etymology && (
                <div style={{
                  backgroundColor: '#141419', borderRadius: '16px', padding: '24px',
                  marginBottom: '24px', border: '1px solid rgba(124, 58, 237, 0.2)',
                  position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute', top: '-50%', right: '-50%',
                    width: '200%', height: '200%', opacity: '0.03',
                    background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
                    pointerEvents: 'none'
                  }} />
                  <div style={{
                    fontSize: '18px', fontWeight: '600', color: '#7C3AED',
                    marginBottom: '16px', display: 'flex', alignItems: 'center'
                  }}>
                    <span style={{
                      backgroundColor: '#7C3AED', color: 'white', fontSize: '12px',
                      padding: '4px 8px', borderRadius: '6px', marginRight: '12px',
                      fontWeight: '700'
                    }}>🌳</span>
                    Etymology
                  </div>
                  <div style={{ color: '#F5F4F2', fontSize: '16px', lineHeight: '1.6' }}>
                    {data.etymology}
                  </div>
                  {data.cognates && (
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '8px' }}>
                        Related words:
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {data.cognates.map((cognate, i) => (
                          <span key={i} style={{
                            backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED',
                            padding: '4px 12px', borderRadius: '12px', fontSize: '14px',
                            border: '1px solid rgba(124, 58, 237, 0.3)'
                          }}>
                            {cognate}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Frequency & Semantic Field */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{
                  backgroundColor: '#141419', borderRadius: '16px', padding: '20px',
                  border: '1px solid rgba(34, 197, 94, 0.2)', textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '32px', fontWeight: '700', color: '#22C55E',
                    marginBottom: '8px'
                  }}>
                    {data.frequency}
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: '14px' }}>
                    Frequency
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#141419', borderRadius: '16px', padding: '20px',
                  border: '1px solid rgba(234, 179, 8, 0.2)', textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '16px', fontWeight: '600', color: '#EAB308',
                    textTransform: 'capitalize'
                  }}>
                    {data.semanticField}
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>
                    Semantic Field
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Paradigm */}
              {data.paradigm && (
                <div style={{
                  backgroundColor: '#141419', borderRadius: '16px', padding: '24px',
                  marginBottom: '24px', border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <div style={{
                    fontSize: '18px', fontWeight: '600', color: '#3B82F6',
                    marginBottom: '20px', display: 'flex', alignItems: 'center'
                  }}>
                    <span style={{
                      backgroundColor: '#3B82F6', color: 'white', fontSize: '12px',
                      padding: '4px 8px', borderRadius: '6px', marginRight: '12px',
                      fontWeight: '700'
                    }}>📚</span>
                    Paradigm
                  </div>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {Object.entries(data.paradigm).map(([form, value]) => (
                      <div key={form} style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: '12px 16px', backgroundColor: 'rgba(59, 130, 246, 0.05)',
                        borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.1)'
                      }}>
                        <span style={{ color: '#9CA3AF', fontSize: '14px' }}>{form}</span>
                        <span style={{ 
                          color: '#F5F4F2', fontSize: '14px', fontFamily: 'serif',
                          fontWeight: form.includes(data.word) ? '700' : '400'
                        }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manuscript Evidence */}
              {data.manuscripts && (
                <div style={{
                  backgroundColor: '#141419', borderRadius: '16px', padding: '24px',
                  marginBottom: '24px', border: '1px solid rgba(220, 38, 38, 0.2)'
                }}>
                  <div style={{
                    fontSize: '18px', fontWeight: '600', color: '#DC2626',
                    marginBottom: '20px', display: 'flex', alignItems: 'center'
                  }}>
                    <span style={{
                      backgroundColor: '#DC2626', color: 'white', fontSize: '12px',
                      padding: '4px 8px', borderRadius: '6px', marginRight: '12px',
                      fontWeight: '700'
                    }}>📜</span>
                    Manuscript Evidence
                  </div>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {data.manuscripts.map((ms, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px 16px', backgroundColor: 'rgba(220, 38, 38, 0.05)',
                        borderRadius: '8px', border: '1px solid rgba(220, 38, 38, 0.1)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            backgroundColor: '#DC2626', color: 'white',
                            padding: '4px 8px', borderRadius: '6px', fontSize: '12px',
                            fontWeight: '700'
                          }}>
                            {ms.siglum}
                          </span>
                          <span style={{ color: '#F5F4F2', fontFamily: 'serif' }}>
                            {ms.reading}
                          </span>
                        </div>
                        <span style={{
                          color: ms.confidence === 'certain' ? '#22C55E' : '#EAB308',
                          fontSize: '12px', fontWeight: '600',
                          backgroundColor: ms.confidence === 'certain' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                          padding: '4px 8px', borderRadius: '12px'
                        }}>
                          {ms.confidence}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Semantic Evolution */}
              {data.semanticDrift && (
                <div style={{
                  backgroundColor: '#141419', borderRadius: '16px', padding: '24px',
                  border: '1px solid rgba(201, 162, 39, 0.2)'
                }}>
                  <div style={{
                    fontSize: '18px', fontWeight: '600', color: '#C9A227',
                    marginBottom: '20px', display: 'flex', alignItems: 'center'
                  }}>
                    <span style={{
                      backgroundColor: '#C9A227', color: '#0D0D0F', fontSize: '12px',
                      padding: '4px 8px', borderRadius: '6px', marginRight: '12px',
                      fontWeight: '700'
                    }}>📈</span>
                    Semantic Evolution
                  </div>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {data.semanticDrift.map((drift, i) => (
                      <div key={i} style={{
                        padding: '16px', backgroundColor: 'rgba(201, 162, 39, 0.03)',
                        borderRadius: '8px', border: '1px solid rgba(201, 162, 39, 0.1)'
                      }}>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          marginBottom: '8px'
                        }}>
                          <span style={{
                            color: eraColors[drift.period] || '#C9A227',
                            fontWeight: '600', fontSize: '14px'
                          }}>
                            {drift.period}
                          </span>
                          <span style={{
                            color: '#9CA3AF', fontSize: '12px',
                            backgroundColor: 'rgba(156, 163, 175, 0.1)',
                            padding: '2px 8px', borderRadius: '10px'
                          }}>
                            {Math.round(drift.frequency * 100)}%
                          </span>
                        </div>
                        <div style={{ color: '#F5F4F2', fontSize: '14px' }}>
                          {drift.meaning}
                        </div>
                        <div style={{
                          width: '100%', height: '4px', backgroundColor: 'rgba(201, 162, 39, 0.1)',
                          borderRadius: '2px', marginTop: '8px', overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${drift.frequency * 100}%`, height: '100%',
                            backgroundColor: eraColors[drift.period] || '#C9A227',
                            borderRadius: '2px', transition: 'width 0.5s ease'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.9) translateY(-20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

function TextReader() {
  const [selectedText, setSelectedText] = useState(sampleTexts[0]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [viewMode, setViewMode] = useState('reading');
  const [showApparatus,