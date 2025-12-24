'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
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

function SemanticDriftChart({ data }) {
  return (
    <div style={{
      width: '100%',
      height: '300px',
      backgroundColor: '#141419',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #1E1E24'
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
        <div style={{
          width: '8px',
          height: '8px',
          backgroundColor: '#C9A227',
          borderRadius: '50%'
        }}></div>
        Semantic Evolution
      </h4>
      
      <svg width="100%" height="200" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#C9A227', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#C9A227', stopOpacity: 0.05 }} />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((y, i) => (
          <line
            key={i}
            x1="40"
            y1={40 + (160 * y)}
            x2="100%"
            y2={40 + (160 * y)}
            stroke="#1E1E24"
            strokeWidth="1"
          />
        ))}
        
        {/* Data line */}
        <path
          d={`M 80,${200 - (data[0]?.frequency || 0) * 160} ${data.map((d, i) => 
            `L ${80 + (i * 120)},${200 - d.frequency * 160}`
          ).join(' ')}`}
          stroke="#C9A227"
          strokeWidth="3"
          fill="none"
          style={{ filter: 'drop-shadow(0 0 8px rgba(201, 162, 39, 0.3))' }}
        />
        
        {/* Area fill */}
        <path
          d={`M 80,200 L 80,${200 - (data[0]?.frequency || 0) * 160} ${data.map((d, i) => 
            `L ${80 + (i * 120)},${200 - d.frequency * 160}`
          ).join(' ')} L ${80 + ((data.length - 1) * 120)},200 Z`}
          fill="url(#chartGradient)"
        />
        
        {/* Data points */}
        {data.map((d, i) => (
          <g key={i}>
            <circle
              cx={80 + (i * 120)}
              cy={200 - d.frequency * 160}
              r="6"
              fill="#C9A227"
              style={{ filter: 'drop-shadow(0 0 6px rgba(201, 162, 39, 0.4))' }}
            />
            <text
              x={80 + (i * 120)}
              y={220}
              textAnchor="middle"
              style={{
                fontSize: '12px',
                fill: '#9CA3AF',
                fontWeight: '500'
              }}
            >
              {d.period}
            </text>
            <text
              x={80 + (i * 120)}
              y={200 - d.frequency * 160 - 15}
              textAnchor="middle"
              style={{
                fontSize: '11px',
                fill: '#F5F4F2',
                fontWeight: '600'
              }}
            >
              {d.meaning}
            </text>
          </g>
        ))}
        
        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((val, i) => (
          <text
            key={i}
            x="30"
            y={205 - (val * 160)}
            textAnchor="end"
            style={{
              fontSize: '11px',
              fill: '#6B7280'
            }}
          >
            {(val * 100).toFixed(0)}%
          </text>
        ))}
      </svg>
    </div>
  )
}

function WordCloudVisualization({ words }) {
  const clusters = {
    emotion: { color: '#DC2626', x: 150, y: 100 },
    performance: { color: '#3B82F6', x: 350, y: 150 },
    warfare: { color: '#059669', x: 250, y: 250 }
  }

  return (
    <div style={{
      width: '100%',
      height: '350px',
      backgroundColor: '#141419',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #1E1E24',
      position: 'relative',
      overflow: 'hidden'
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
        <div style={{
          width: '8px',
          height: '8px',
          backgroundColor: '#3B82F6',
          borderRadius: '50%'
        }}></div>
        Semantic Clusters
      </h4>
      
      <svg width="100%" height="280" style={{ overflow: 'visible' }}>
        <defs>
          {Object.entries(clusters).map(([cluster, data]) => (
            <radialGradient key={cluster} id={`cluster-${cluster}`}>
              <stop offset="0%" style={{ stopColor: data.color, stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: data.color, stopOpacity: 0.05 }} />
            </radialGradient>
          ))}
        </defs>
        
        {/* Cluster backgrounds */}
        {Object.entries(clusters).map(([cluster, data]) => (
          <circle
            key={cluster}
            cx={data.x}
            cy={data.y}
            r="80"
            fill={`url(#cluster-${cluster})`}
            stroke={data.color}
            strokeWidth="1"
            strokeOpacity="0.3"
          />
        ))}
        
        {/* Words */}
        {Object.values(words).map((word, i) => {
          const cluster = clusters[word.cluster] || clusters.emotion
          const angle = (i / Object.keys(words).length) * 2 * Math.PI
          const radius = 40 + (word.frequency / 200) * 30
          const x = cluster.x + Math.cos(angle) * radius
          const y = cluster.y + Math.sin(angle) * radius
          
          return (
            <g key={word.word}>
              <circle
                cx={x}
                cy={y}
                r={4 + (word.frequency / 200) * 8}
                fill={cluster.color}
                opacity="0.8"
                style={{ 
                  filter: `drop-shadow(0 0 4px ${cluster.color})`,
                  cursor: 'pointer'
                }}
              />
              <text
                x={x}
                y={y - 15}
                textAnchor="middle"
                style={{
                  fontSize: `${10 + (word.frequency / 200) * 4}px`,
                  fill: '#F5F4F2',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {word.word}
              </text>
            </g>
          )
        })}
        
        {/* Cluster labels */}
        {Object.entries(clusters).map(([cluster, data]) => (
          <text
            key={cluster}
            x={data.x}
            y={data.y + 100}
            textAnchor="middle"
            style={{
              fontSize: '14px',
              fill: data.color,
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            {cluster}
          </text>
        ))}
      </svg>
    </div>
  )
}

function FrequencyDistribution({ words }) {
  const sortedWords = Object.values(words).sort((a, b) => b.frequency - a.frequency)
  const maxFreq = Math.max(...sortedWords.map(w => w.frequency))

  return (
    <div style={{
      width: '100%',
      height: '300px',
      backgroundColor: '#141419',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #1E1E24'
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
        <div style={{
          width: '8px',
          height: '8px',
          backgroundColor: '#7C3AED',
          borderRadius: '50%'
        }}></div>
        Word Frequency Distribution
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sortedWords.map((word, i) => (
          <div key={word.word} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '60px',
              fontSize: '14px',
              color: '#F5F4F2',
              fontWeight: '600',
              fontFamily: 'monospace'
            }}>
              {word.word}
            </div>
            
            <div style={{
              flex: 1,
              height: '20px',
              backgroundColor: '#1E1E24',
              borderRadius: '10px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(word.frequency / maxFreq) * 100}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${word.semanticField === 'emotion' ? '#DC2626' : word.semanticField === 'performance' ? '#3B82F6' : '#059669'}, ${word.semanticField === 'emotion' ? '#DC262650' : word.semanticField === 'performance' ? '#3B82F650' : '#05966950'})`,
                borderRadius: '10px',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            
            <div style={{
              width: '40px',
              fontSize: '12px',
              color: '#9CA3AF',
              textAlign: 'right'
            }}>
              {word.frequency}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DataVizContent() {
  const searchParams = useSearchParams()
  const [activeVisualization, setActiveVisualization] = useState('semantic-drift')
  const [selectedWord, setSelectedWord] = useState('μῆνιν')
  const [hoveredElement, setHoveredElement] = useState(null)

  const visualizations = [
    { id: 'semantic-drift', name: 'Semantic Drift', icon: '📈' },
    { id: 'word-cloud', name: 'Semantic Clusters', icon: '🌐' },
    { id: 'frequency', name: 'Frequency Analysis', icon: '📊' }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
        borderBottom: '1px solid #1E1E24',
        padding: '20px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{
              color: '#C9A227',
              textDecoration: 'none',
              fontSize: '24px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                background: 'linear-gradient(45deg, #C9A227, #F59E0B)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                LOGOS
              </span>
            </Link>
            
            <div style={{
              width: '1px',
              height: '24px',
              backgroundColor: '#1E1E24'
            }}></div>
            
            <h1 style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '24px' }}>📊</span>
              Data Visualization Studio
            </h1>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 24px'
      }}>
        {/* Visualization Controls */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Control Panel */}
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #141419',
            height: 'fit-content',
            position: 'sticky',
            top: '120px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
              color: '#F5F4F2',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ color: '#C9A227' }}>⚡</span>
              Visualization Controls
            </h3>
            
            {/* Visualization Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                fontSize: '14px',
                color: '#9CA3AF',
                fontWeight: '600',
                marginBottom: '8px',
                display: 'block'
              }}>
                Visualization Type
              </label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {visualizations.map(viz => (
                  <button
                    key={viz.id}
                    onClick={() => setActiveVisualization(viz.id)}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: activeVisualization === viz.id ? '#C9A227' : '#141419',
                      color: activeVisualization === viz.id ? '#0D0D0F' : '#F5F4F2',
                      border: '1px solid',
                      borderColor: activeVisualization === viz.id ? '#C9A227' : '#1E1E24',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      if (activeVisualization !== viz.id) {
                        e.target.style.backgroundColor = '#1E1E24'
                        e.target.style.borderColor = '#C9A227'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeVisualization !== viz.id) {
                        e.target.style.backgroundColor = '#141419'
                        e.target.style.borderColor = '#1E1E24'
                      }
                    }}
                  >
                    <span>{viz.icon}</span>
                    {viz.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Word Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                fontSize: '14px',
                color: '#9CA3AF',
                fontWeight: '600',
                marginBottom: '8px',
                display: 'block'
              }}>
                Selected Word
              </label>
              
              <select
                value={selectedWord}
                onChange={(e) => setSelectedWord(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#141419',
                  color: '#F5F4F2',
                  border: '1px solid #1E1E24',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {Object.keys(wordData).map(word => (
                  <option key={word} value={word}>{word}</option>
                ))}
              </select>
            </div>
            
            {/* Word Info Panel */}
            {wordData[selectedWord] && (
              <div style={{
                padding: '16px',
                backgroundColor: '#141419',
                borderRadius: '12px',
                border: '1px solid #1E1E24'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#C9A227'
                }}>
                  {wordData[selectedWord].word}
                </h4>
                
                <div style={{
                  fontSize: '13px',
                  color: '#9CA3AF',
                  marginBottom: '8px'
                }}>
                  {wordData[selectedWord].partOfSpeech}
                </div>
                
                <div style={{
                  fontSize: '14px',
                  color: '#F5F4F2',
                  lineHeight: '1.5',
                  marginBottom: '12px'
                }}>
                  {wordData[selectedWord].definition}
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#6B7280'
                }}>
                  <span>Frequency:</span>
                  <span style={{
                    color: '#C9A227',
                    fontWeight: '600'
                  }}>
                    {wordData[selectedWord].frequency}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Main Visualization Area */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {activeVisualization === 'semantic-drift' && wordData[selectedWord]?.semanticDrift && (
              <SemanticDriftChart data={wordData[selectedWord].semanticDrift} />
            )}
            
            {activeVisualization === 'word-cloud' && (
              <WordCloudVisualization words={wordData} />
            )}
            
            {activeVisualization === 'frequency' && (
              <FrequencyDistribution words={wordData} />
            )}
            
            {/* Additional Analysis Panels */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px'
            }}>
              {/* Manuscript Evidence */}
              <div style={{
                backgroundColor: '#1E1E24',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #141419'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: '#F5F4F2',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ color: '#059669' }}>📜</span>
                  Manuscript Evidence
                </h4>
                
                {wordData[selectedWord]?.manuscripts?.map((