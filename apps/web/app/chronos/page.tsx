'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ChronosPage() {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [expandedNode, setExpandedNode] = useState<number | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  const concepts = {
    'ἀρετή': {
      transliteration: 'arete',
      modern: 'virtue',
      data: [
        {
          era: 'Archaic',
          period: '800-500 BCE',
          meaning: 'Battle excellence, prowess in war',
          authors: 'Homer, Hesiod',
          confidence: 92,
          color: '#D97706'
        },
        {
          era: 'Classical',
          period: '500-323 BCE',
          meaning: 'Moral excellence, ethical virtue',
          authors: 'Plato, Aristotle',
          confidence: 95,
          color: '#F59E0B'
        },
        {
          era: 'Hellenistic',
          period: '323-31 BCE',
          meaning: 'Philosophical virtue, wisdom',
          authors: 'Stoics, Epicurus',
          confidence: 88,
          color: '#3B82F6'
        },
        {
          era: 'Imperial',
          period: '31 BCE-284 CE',
          meaning: 'Civic virtue, public duty',
          authors: 'Plutarch, Marcus Aurelius',
          confidence: 85,
          color: '#DC2626'
        },
        {
          era: 'Late Antique',
          period: '284-600 CE',
          meaning: 'Christian virtue, divine grace',
          authors: 'Augustine, John Chrysostom',
          confidence: 90,
          color: '#7C3AED'
        }
      ]
    },
    'λόγος': {
      transliteration: 'logos',
      modern: 'word/reason',
      data: [
        {
          era: 'Archaic',
          period: '800-500 BCE',
          meaning: 'Speech, story, account',
          authors: 'Homer, Heraclitus',
          confidence: 94,
          color: '#D97706'
        },
        {
          era: 'Classical',
          period: '500-323 BCE',
          meaning: 'Reason, rational argument',
          authors: 'Plato, Aristotle',
          confidence: 96,
          color: '#F59E0B'
        },
        {
          era: 'Hellenistic',
          period: '323-31 BCE',
          meaning: 'Cosmic reason, divine principle',
          authors: 'Stoics, Philo',
          confidence: 91,
          color: '#3B82F6'
        },
        {
          era: 'Late Antique',
          period: '284-600 CE',
          meaning: 'Divine Word, Christ',
          authors: 'John, Origen, Augustine',
          confidence: 93,
          color: '#7C3AED'
        }
      ]
    },
    'δίκη': {
      transliteration: 'dike',
      modern: 'justice',
      data: [
        {
          era: 'Archaic',
          period: '800-500 BCE',
          meaning: 'Custom, traditional way',
          authors: 'Homer, Hesiod',
          confidence: 90,
          color: '#D97706'
        },
        {
          era: 'Classical',
          period: '500-323 BCE',
          meaning: 'Justice, legal lawsuit',
          authors: 'Plato, Demosthenes',
          confidence: 94,
          color: '#F59E0B'
        },
        {
          era: 'Imperial',
          period: '31 BCE-284 CE',
          meaning: 'Legal procedure, court system',
          authors: 'Cicero, Quintilian',
          confidence: 87,
          color: '#DC2626'
        }
      ]
    }
  };

  const handleConceptSelect = (concept: string) => {
    setSelectedConcept(concept);
    setExpandedNode(null);
    setAnimationKey(prev => prev + 1);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        padding: '16px 32px',
        borderBottom: '1px solid #1E1E24',
        backgroundColor: '#0D0D0F'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#C9A227',
            textDecoration: 'none'
          }}>
            ΛΟΓΟΣ
          </Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/morpheus" style={{ color: '#9CA3AF', textDecoration: 'none' }}>MORPHEUS</Link>
            <Link href="/chronos" style={{ color: '#C9A227', textDecoration: 'none' }}>CHRONOS</Link>
            <Link href="/hermes" style={{ color: '#9CA3AF', textDecoration: 'none' }}>HERMES</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{
            fontSize: '72px',
            fontWeight: 'bold',
            margin: '0',
            background: 'linear-gradient(135deg, #C9A227 0%, #E8D5A3 50%, #F59E0B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '4px'
          }}>
            CHRONOS
          </h1>
          <p style={{
            fontSize: '24px',
            color: '#9CA3AF',
            marginTop: '16px',
            maxWidth: '800px',
            margin: '16px auto 0'
          }}>
            Witness the evolution of concepts through time. Track how words transformed across millennia of human thought.
          </p>
        </div>

        {/* Concept Selector */}
        <div style={{
          display: 'flex',
          gap: '24px',
          justifyContent: 'center',
          marginBottom: '64px',
          flexWrap: 'wrap'
        }}>
          {Object.keys(concepts).map((concept) => (
            <button
              key={concept}
              onClick={() => handleConceptSelect(concept)}
              style={{
                padding: '20px 40px',
                backgroundColor: selectedConcept === concept ? '#C9A227' : '#1E1E24',
                border: selectedConcept === concept ? '2px solid #E8D5A3' : '2px solid #2D2D32',
                borderRadius: '12px',
                color: selectedConcept === concept ? '#0D0D0F' : '#F5F4F2',
                fontSize: '24px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '180px'
              }}
              onMouseEnter={(e) => {
                if (selectedConcept !== concept) {
                  e.target.style.backgroundColor = '#2D2D32';
                  e.target.style.borderColor = '#C9A227';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedConcept !== concept) {
                  e.target.style.backgroundColor = '#1E1E24';
                  e.target.style.borderColor = '#2D2D32';
                }
              }}
            >
              {concept}
              <div style={{
                fontSize: '14px',
                fontWeight: 'normal',
                marginTop: '4px',
                color: selectedConcept === concept ? '#0D0D0F' : '#9CA3AF'
              }}>
                {concepts[concept].transliteration}
              </div>
            </button>
          ))}
        </div>

        {/* Timeline Visualization */}
        {selectedConcept && (
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '16px',
            padding: '48px',
            border: '1px solid #2D2D32',
            animation: `fadeIn 0.6s ease-out`,
            animationFillMode: 'both'
          }}>
            {/* Concept Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: '48px'
            }}>
              <h2 style={{
                fontSize: '48px',
                margin: '0',
                color: '#C9A227',
                letterSpacing: '2px'
              }}>
                {selectedConcept}
              </h2>
              <p style={{
                fontSize: '20px',
                color: '#9CA3AF',
                margin: '8px 0 0 0'
              }}>
                {concepts[selectedConcept].transliteration} • {concepts[selectedConcept].modern}
              </p>
            </div>

            {/* Vertical Timeline */}
            <div style={{
              position: 'relative',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {/* Timeline Line */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '0',
                bottom: '0',
                width: '4px',
                background: 'linear-gradient(to bottom, #C9A227, #E8D5A3)',
                transform: 'translateX(-50%)',
                borderRadius: '2px'
              }} />

              {concepts[selectedConcept].data.map((item, index) => (
                <div
                  key={`${animationKey}-${index}`}
                  style={{
                    position: 'relative',
                    marginBottom: index === concepts[selectedConcept].data.length - 1 ? '0' : '80px',
                    animation: `slideInTimeline 0.8s ease-out ${index * 0.2}s both`
                  }}
                >
                  {/* Timeline Node */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '20px',
                      width: '24px',
                      height: '24px',
                      backgroundColor: item.color,
                      borderRadius: '50%',
                      transform: 'translateX(-50%)',
                      border: '4px solid #1E1E24',
                      cursor: 'pointer',
                      zIndex: 10,
                      boxShadow: expandedNode === index ? `0 0 20px ${item.color}` : 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setExpandedNode(expandedNode === index ? null : index)}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateX(-50%) scale(1.3)';
                      e.target.style.boxShadow = `0 0 20px ${item.color}`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateX(-50%) scale(1)';
                      e.target.style.boxShadow = expandedNode === index ? `0 0 20px ${item.color}` : 'none';
                    }}
                  />

                  {/* Era Card */}
                  <div style={{
                    width: index % 2 === 0 ? '45%' : '45%',
                    marginLeft: index % 2 === 0 ? '0' : '55%',
                    backgroundColor: '#141419',
                    border: `2px solid ${item.color}`,
                    borderRadius: '12px',
                    padding: '24px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setExpandedNode(expandedNode === index ? null : index)}>
                    <h3 style={{
                      margin: '0 0 8px 0',
                      fontSize: '24px',
                      color: item.color,
                      fontWeight: 'bold'
                    }}>
                      {item.era}
                    </h3>
                    <p style={{
                      margin: '0 0 16px 0',
                      fontSize: '14px',
                      color: '#9CA3AF',
                      fontWeight: '600'
                    }}>
                      {item.period}
                    </p>
                    <p style={{
                      margin: '0 0 16px 0',
                      fontSize: '18px',
                      color: '#F5F4F2',
                      lineHeight: '1.5'
                    }}>
                      {item.meaning}
                    </p>
                    
                    {/* Expanded Content */}
                    {expandedNode === index && (
                      <div style={{
                        animation: 'expandContent 0.3s ease-out',
                        borderTop: `1px solid ${item.color}`,
                        paddingTop: '16px',
                        marginTop: '16px'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '16px'
                        }}>
                          <div>
                            <p style={{
                              margin: '0 0 8px 0',
                              fontSize: '16px',
                              color: '#F5F4F2',
                              fontWeight: '600'
                            }}>
                              Key Authors
                            </p>
                            <p style={{
                              margin: '0',
                              fontSize: '14px',
                              color: '#9CA3AF'
                            }}>
                              {item.authors}
                            </p>
                          </div>
                          <div style={{
                            textAlign: 'right'
                          }}>
                            <p style={{
                              margin: '0 0 4px 0',
                              fontSize: '12px',
                              color: '#9CA3AF'
                            }}>
                              Confidence
                            </p>
                            <p style={{
                              margin: '0',
                              fontSize: '24px',
                              color: item.color,
                              fontWeight: 'bold'
                            }}>
                              {item.confidence}%
                            </p>
                          </div>
                        </div>
                        
                        {/* Confidence Bar */}
                        <div style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: '#2D2D32',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${item.confidence}%`,
                            height: '100%',
                            backgroundColor: item.color,
                            borderRadius: '4px',
                            animation: 'fillBar 1s ease-out'
                          }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInTimeline {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes expandContent {
          from {
            opacity: 0;
            transform: scaleY(0);
          }
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }

        @keyframes fillBar {
          from {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}