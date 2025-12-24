'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface WordData {
  word: string;
  transliteration: string;
  occurrences: number;
  traditional: string;
  corpus: string;
  insight: string;
  timeline: {
    era: string;
    meaning: string;
    confidence: number;
    color: string;
  }[];
}

export default function Semantia() {
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const words: WordData[] = [
    {
      word: 'ἀρετή',
      transliteration: 'aretē',
      occurrences: 2847,
      traditional: 'virtue',
      corpus: 'excellence → moral virtue → Christian virtue',
      insight: 'LSJ misses the shift from Homeric battle prowess to Platonic moral virtue',
      timeline: [
        { era: 'Archaic', meaning: 'Battle excellence', confidence: 92, color: '#D97706' },
        { era: 'Classical', meaning: 'Moral excellence', confidence: 95, color: '#F59E0B' },
        { era: 'Late Antique', meaning: 'Christian virtue', confidence: 90, color: '#7C3AED' },
      ]
    },
    {
      word: 'λόγος',
      transliteration: 'logos',
      occurrences: 12453,
      traditional: 'word, reason',
      corpus: 'speech → reason → cosmic principle → divine Word',
      insight: 'Most dramatic semantic transformation in Greek',
      timeline: [
        { era: 'Archaic', meaning: 'Speech, story', confidence: 94, color: '#D97706' },
        { era: 'Classical', meaning: 'Reason, argument', confidence: 96, color: '#F59E0B' },
        { era: 'Hellenistic', meaning: 'Cosmic reason', confidence: 91, color: '#3B82F6' },
        { era: 'Late Antique', meaning: 'Divine Word', confidence: 93, color: '#7C3AED' },
      ]
    },
    {
      word: 'ψυχή',
      transliteration: 'psychē',
      occurrences: 5621,
      traditional: 'soul',
      corpus: 'breath-soul → immortal soul',
      insight: "Homer's psychē is NOT Plato's",
      timeline: [
        { era: 'Archaic', meaning: 'Breath, life-force', confidence: 93, color: '#D97706' },
        { era: 'Classical', meaning: 'Immortal soul', confidence: 95, color: '#F59E0B' },
      ]
    }
  ];

  useEffect(() => {
    if (selectedWord && showAnalysis) {
      let current = 0;
      const increment = Math.ceil(selectedWord.occurrences / 100);
      const timer = setInterval(() => {
        current += increment;
        if (current >= selectedWord.occurrences) {
          current = selectedWord.occurrences;
          clearInterval(timer);
        }
        setAnimatedCount(current);
      }, 30);
      return () => clearInterval(timer);
    }
  }, [selectedWord, showAnalysis]);

  const handleWordClick = (word: WordData) => {
    setSelectedWord(word);
    setAnimatedCount(0);
    setShowAnalysis(false);
    setTimeout(() => setShowAnalysis(true), 100);
  };

  const closeAnalysis = () => {
    setSelectedWord(null);
    setShowAnalysis(false);
    setAnimatedCount(0);
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#1E1E24',
        padding: '16px 32px',
        borderBottom: '1px solid #141419'
      }}>
        <Link href="/" style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#C9A227',
          textDecoration: 'none'
        }}>
          LOGOS
        </Link>
      </nav>

      {/* Hero Section */}
      <div style={{ padding: '64px 32px 32px', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '72px',
          fontWeight: 'bold',
          margin: '0 0 16px 0',
          background: 'linear-gradient(45deg, #C9A227, #E8D5A3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          SEMANTIA
        </h1>
        <p style={{
          fontSize: '24px',
          color: '#9CA3AF',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Witness the evolution of meaning across millennia. How words transform their essence 
          through the currents of time, culture, and human understanding.
        </p>
      </div>

      {!selectedWord ? (
        /* Word Cards */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          padding: '32px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {words.map((word) => (
            <div
              key={word.word}
              onClick={() => handleWordClick(word)}
              style={{
                backgroundColor: '#1E1E24',
                border: '1px solid #141419',
                borderRadius: '16px',
                padding: '32px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: 'scale(1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.backgroundColor = '#252530';
                e.currentTarget.style.borderColor = '#C9A227';
                e.currentTarget.style.boxShadow = '0 8px 40px rgba(201,162,39,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#1E1E24';
                e.currentTarget.style.borderColor = '#141419';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
              }}
            >
              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#C9A227',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                {word.word}
              </div>
              <div style={{
                fontSize: '20px',
                color: '#9CA3AF',
                fontStyle: 'italic',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                {word.transliteration}
              </div>
              <div style={{
                fontSize: '16px',
                color: '#6B7280',
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                {word.occurrences.toLocaleString()} occurrences
              </div>
              <div style={{
                fontSize: '18px',
                color: '#F5F4F2',
                textAlign: 'center',
                lineHeight: '1.5'
              }}>
                {word.corpus}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Full Analysis */
        <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
          {/* Close Button */}
          <button
            onClick={closeAnalysis}
            style={{
              position: 'fixed',
              top: '100px',
              right: '32px',
              backgroundColor: '#1E1E24',
              border: '1px solid #C9A227',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              color: '#C9A227',
              fontSize: '24px',
              cursor: 'pointer',
              zIndex: 1000,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A227';
              e.currentTarget.style.color = '#0D0D0F';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1E1E24';
              e.currentTarget.style.color = '#C9A227';
            }}
          >
            ×
          </button>

          {/* Giant Word Display */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              fontSize: '120px',
              fontWeight: 'bold',
              color: '#C9A227',
              marginBottom: '16px',
              textShadow: '0 0 20px rgba(201,162,39,0.3)'
            }}>
              {selectedWord.word}
            </div>
            <div style={{
              fontSize: '32px',
              color: '#9CA3AF',
              fontStyle: 'italic',
              marginBottom: '24px'
            }}>
              {selectedWord.transliteration}
            </div>
            <div style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#E8D5A3',
              marginBottom: '8px'
            }}>
              {showAnalysis ? animatedCount.toLocaleString() : '0'}
            </div>
            <div style={{
              fontSize: '20px',
              color: '#6B7280'
            }}>
              corpus occurrences
            </div>
          </div>

          {/* Meaning Comparison */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            marginBottom: '48px'
          }}>
            <div style={{
              backgroundColor: '#1E1E24',
              border: '1px solid #141419',
              borderRadius: '16px',
              padding: '32px'
            }}>
              <h3 style={{
                fontSize: '24px',
                color: '#DC2626',
                marginBottom: '16px',
                fontWeight: 'bold'
              }}>
                Traditional Definition
              </h3>
              <p style={{
                fontSize: '20px',
                color: '#F5F4F2',
                lineHeight: '1.6'
              }}>
                "{selectedWord.traditional}"
              </p>
            </div>
            <div style={{
              backgroundColor: '#1E1E24',
              border: '1px solid #141419',
              borderRadius: '16px',
              padding: '32px'
            }}>
              <h3 style={{
                fontSize: '24px',
                color: '#059669',
                marginBottom: '16px',
                fontWeight: 'bold'
              }}>
                Corpus Evolution
              </h3>
              <p style={{
                fontSize: '20px',
                color: '#F5F4F2',
                lineHeight: '1.6'
              }}>
                {selectedWord.corpus}
              </p>
            </div>
          </div>

          {/* Visual Timeline */}
          <div style={{
            backgroundColor: '#1E1E24',
            border: '1px solid #141419',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px'
          }}>
            <h3 style={{
              fontSize: '32px',
              color: '#C9A227',
              marginBottom: '32px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              Semantic Timeline
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {selectedWord.timeline.map((era, index) => (
                <div key={era.era} style={{
                  opacity: showAnalysis ? 1 : 0,
                  transform: showAnalysis ? 'translateX(0)' : 'translateX(-50px)',
                  transition: `all 0.8s ease ${index * 0.2}s`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: era.color,
                      width: '120px'
                    }}>
                      {era.era}
                    </div>
                    <div style={{
                      fontSize: '18px',
                      color: '#F5F4F2',
                      flex: 1,
                      marginLeft: '16px'
                    }}>
                      {era.meaning}
                    </div>
                    <div style={{
                      fontSize: '16px',
                      color: '#9CA3AF',
                      width: '60px',
                      textAlign: 'right'
                    }}>
                      {era.confidence}%
                    </div>
                  </div>
                  <div style={{
                    height: '8px',
                    backgroundColor: '#141419',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginLeft: '136px'
                  }}>
                    <div style={{
                      height: '100%',
                      backgroundColor: era.color,
                      width: showAnalysis ? `${era.confidence}%` : '0%',
                      transition: `width 1s ease ${index * 0.2 + 0.5}s`,
                      borderRadius: '4px',
                      boxShadow: `0 0 10px ${era.color}40`
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LOGOS Insight */}
          <div style={{
            backgroundColor: '#141419',
            border: '2px solid #C9A227',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            opacity: showAnalysis ? 1 : 0,
            transform: showAnalysis ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1s ease 1.5s'
          }}>
            <h3 style={{
              fontSize: '28px',
              color: '#C9A227',
              marginBottom: '16px',
              fontWeight: 'bold'
            }}>
              🔍 LOGOS Insight
            </h3>
            <p style={{
              fontSize: '20px',
              color: '#F5F4F2',
              fontStyle: 'italic',
              lineHeight: '1.6',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              "{selectedWord.insight}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}