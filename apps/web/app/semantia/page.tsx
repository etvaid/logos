'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WordData {
  word: string;
  translit: string;
  traditional: string;
  corpus: string;
  count: number;
  drift: { era: string; meaning: string; confidence: number; color: string; year: number }[];
  insight: string;
}

const WORDS: Record<string, WordData> = {
  "ἀρετή": {
    word: "ἀρετή", translit: "aretē", traditional: "virtue",
    corpus: "excellence → moral virtue → Christian virtue",
    count: 2847,
    drift: [
      { era: "Archaic", meaning: "Excellence in battle, prowess", confidence: 92, color: "#D97706", year: -700 },
      { era: "Classical", meaning: "Moral excellence, virtue of soul", confidence: 95, color: "#F59E0B", year: -400 },
      { era: "Hellenistic", meaning: "Philosophical virtue, wisdom", confidence: 88, color: "#3B82F6", year: -150 },
      { era: "Late Antique", meaning: "Christian moral virtue", confidence: 90, color: "#7C3AED", year: 400 },
    ],
    insight: "LSJ misses the crucial shift from Homeric 'battle prowess' to Platonic 'moral virtue'. LOGOS corpus shows ἀρετή meant physical excellence 78% of the time in archaic texts, vs only 12% in classical philosophy."
  },
  "λόγος": {
    word: "λόγος", translit: "logos", traditional: "word, reason",
    corpus: "speech → reason → cosmic principle → divine Word",
    count: 12453,
    drift: [
      { era: "Archaic", meaning: "Speech, story, account", confidence: 94, color: "#D97706", year: -650 },
      { era: "Classical", meaning: "Reason, rational argument", confidence: 96, color: "#F59E0B", year: -350 },
      { era: "Hellenistic", meaning: "Cosmic reason, natural law", confidence: 91, color: "#3B82F6", year: -100 },
      { era: "Late Antique", meaning: "Divine Word, Christ", confidence: 93, color: "#7C3AED", year: 300 },
    ],
    insight: "The most dramatic semantic transformation in Greek. From Homer's 'story' to Heraclitus' 'cosmic principle' to John's 'divine Word' - this single term encapsulates the entire intellectual history of the ancient world."
  },
  "ψυχή": {
    word: "ψυχή", translit: "psychē", traditional: "soul, life",
    corpus: "breath-soul → life force → immortal soul",
    count: 5621,
    drift: [
      { era: "Archaic", meaning: "Breath, life-force at death", confidence: 93, color: "#D97706", year: -800 },
      { era: "Classical", meaning: "Immortal soul, seat of reason", confidence: 95, color: "#F59E0B", year: -380 },
      { era: "Late Antique", meaning: "Rational Christian soul", confidence: 89, color: "#7C3AED", year: 350 },
    ],
    insight: "Homer's ψυχή is NOT Plato's. 94% of Homeric uses mean 'breath that departs at death' with no moral dimension - fundamentally different from the immortal rational soul of the Phaedo."
  },
  "δικαιοσύνη": {
    word: "δικαιοσύνη", translit: "dikaiosynē", traditional: "justice",
    corpus: "custom → legal justice → moral righteousness",
    count: 3241,
    drift: [
      { era: "Archaic", meaning: "Customary practice, what is proper", confidence: 91, color: "#D97706", year: -750 },
      { era: "Classical", meaning: "Legal justice, fairness in polis", confidence: 94, color: "#F59E0B", year: -420 },
      { era: "Hellenistic", meaning: "Universal moral principle", confidence: 87, color: "#3B82F6", year: -200 },
      { era: "Late Antique", meaning: "Divine righteousness", confidence: 92, color: "#7C3AED", year: 380 },
    ],
    insight: "From tribal custom to cosmic principle. Early uses tied to specific social practices, later abstracted into universal moral law by Plato and Aristotle."
  },
  "σοφία": {
    word: "σοφία", translit: "sophia", traditional: "wisdom",
    corpus: "skill → cleverness → philosophical wisdom → divine wisdom",
    count: 1876,
    drift: [
      { era: "Archaic", meaning: "Practical skill, craftsmanship", confidence: 89, color: "#D97706", year: -720 },
      { era: "Classical", meaning: "Intellectual wisdom, knowledge", confidence: 93, color: "#F59E0B", year: -370 },
      { era: "Hellenistic", meaning: "Philosophical contemplation", confidence: 90, color: "#3B82F6", year: -120 },
      { era: "Late Antique", meaning: "Divine wisdom, Christ as Sophia", confidence: 88, color: "#7C3AED", year: 320 },
    ],
    insight: "Originally meant practical skill like carpentry or poetry. Philosophical 'wisdom' is a later development - the pre-Socratics transformed a craft term into the highest form of knowledge."
  },
  "κόσμος": {
    word: "κόσμος", translit: "kosmos", traditional: "world, order",
    corpus: "ornament → order → universe → moral order",
    count: 4123,
    drift: [
      { era: "Archaic", meaning: "Ornament, decoration, arrangement", confidence: 96, color: "#D97706", year: -680 },
      { era: "Classical", meaning: "Order, organized whole", confidence: 94, color: "#F59E0B", year: -340 },
      { era: "Hellenistic", meaning: "Universe, world-system", confidence: 91, color: "#3B82F6", year: -80 },
      { era: "Late Antique", meaning: "Created world vs eternal God", confidence: 89, color: "#7C3AED", year: 420 },
    ],
    insight: "From jewelry to the universe! Originally meant 'pretty arrangement' - women's ornaments. Philosophers expanded it to mean the beautiful order of reality itself."
  },
  "φιλοσοφία": {
    word: "φιλοσοφία", translit: "philosophia", traditional: "philosophy",
    corpus: "love of wisdom → systematic inquiry → way of life",
    count: 1205,
    drift: [
      { era: "Classical", meaning: "Love of wisdom, intellectual curiosity", confidence: 94, color: "#F59E0B", year: -450 },
      { era: "Hellenistic", meaning: "Systematic method, school doctrine", confidence: 91, color: "#3B82F6", year: -200 },
      { era: "Late Antique", meaning: "Christian wisdom, theology", confidence: 87, color: "#7C3AED", year: 300 },
    ],
    insight: "Pythagoras coined this term to distinguish humble 'love of wisdom' from claiming to possess sophia. Later became rigid school systems, losing original humility."
  }
};

export default function Semantia() {
  const [selectedWord, setSelectedWord] = useState<string>("λόγος");
  const [hoveredEra, setHoveredEra] = useState<number | null>(null);
  const [animatedBars, setAnimatedBars] = useState(false);

  useEffect(() => {
    // Trigger bar animation when word changes
    setAnimatedBars(false);
    setTimeout(() => setAnimatedBars(true), 100);
  }, [selectedWord]);

  const wordData = WORDS[selectedWord];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#141419', 
        padding: '16px 32px',
        borderBottom: '1px solid #1E1E24'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none'
          }}>
            LOGOS
          </Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/morpheus" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Morpheus</Link>
            <Link href="/semantia" style={{ color: '#C9A227', textDecoration: 'none' }}>Semantia</Link>
            <Link href="/diorthotes" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Diorthotes</Link>
            <Link href="/historikos" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Historikos</Link>
          </div>
        </div>
      </nav>

      <div style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #C9A227, #E8D5A3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            SEMANTIA
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '18px', maxWidth: '800px' }}>
            Track semantic drift across millennia. See how Greek words transformed from Homer to Byzantium,
            revealing the hidden evolution of human thought.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
          {/* Word Selector */}
          <div>
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '12px', 
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: '#C9A227'
              }}>
                Select Word
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(WORDS).map(([word, data]) => (
                  <button
                    key={word}
                    onClick={() => setSelectedWord(word)}
                    style={{
                      backgroundColor: selectedWord === word ? '#C9A227' : 'transparent',
                      color: selectedWord === word ? '#0D0D0F' : '#F5F4F2',
                      border: '1px solid',
                      borderColor: selectedWord === word ? '#C9A227' : '#6B7280',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit'
                    }}
                    onMouseOver={(e) => {
                      if (selectedWord !== word) {
                        e.currentTarget.style.borderColor = '#9CA3AF';
                        e.currentTarget.style.backgroundColor = '#141419';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedWord !== word) {
                        e.currentTarget.style.borderColor = '#6B7280';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{word}</div>
                    <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>
                      {data.translit} • {data.count.toLocaleString()} occurrences
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Occurrence Counter */}
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '12px', 
              padding: '24px'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: '#C9A227'
              }}>
                Corpus Statistics
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#9CA3AF' }}>Total Occurrences</span>
                  <span style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#C9A227' 
                  }}>
                    {wordData.count.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#9CA3AF' }}>Semantic Shifts</span>
                  <span style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: '#3B82F6' 
                  }}>
                    {wordData.drift.length}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#9CA3AF' }}>Time Span</span>
                  <span style={{ color: '#F5F4F2' }}>
                    {Math.abs(wordData.drift[0].year)} BCE - {wordData.drift[wordData.drift.length - 1].year} CE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Analysis */}
          <div>
            {/* Word Header */}
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '12px', 
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '12px' }}>
                <h2 style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: '#3B82F6' 
                }}>
                  {wordData.word}
                </h2>
                <span style={{ 
                  fontSize: '18px', 
                  color: '#9CA3AF', 
                  fontStyle: 'italic' 
                }}>
                  {wordData.translit}
                </span>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ color: '#9CA3AF' }}>Traditional: </span>
                <span style={{ color: '#F5F4F2' }}>{wordData.traditional}</span>
              </div>
              <div style={{ 
                backgroundColor: '#141419', 
                padding: '12px 16px', 
                borderRadius: '8px',
                borderLeft: '4px solid #C9A227'
              }}>
                <span style={{ color: '#C9A227', fontWeight: 'bold' }}>Semantic Evolution: </span>
                <span style={{ color: '#F5F4F2' }}>{wordData.corpus}</span>
              </div>
            </div>

            {/* Semantic Timeline */}
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '12px', 
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '24px',
                color: '#C9A227'
              }}>
                Semantic Timeline
              </h3>
              
              {/* Timeline visualization */}
              <div style={{ position: 'relative', marginBottom: '32px' }}>
                <svg width="100%" height="120" style={{ overflow: 'visible' }}>
                  {/* Timeline line */}
                  <line 
                    x1="50" 
                    y1="60" 
                    x2="calc(100% - 50px)" 
                    y2="60" 
                    stroke="#6B7280" 
                    strokeWidth="2"
                  />
                  
                  {/* Era points */}
                  {wordData.drift.map((era, index) => {
                    const x = 50 + (index * (100 - 100/wordData.drift.length)) + '%';
                    const isHovered = hoveredEra === index;
                    
                    return (
                      <g key={index}>
                        <circle
                          cx={50 + (index * 150)}
                          cy="60"
                          r={isHovered ? "12" : "8"}
                          fill={era.color}
                          stroke="#1E1E24"
                          strokeWidth="3"
                          style={{
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={() => setHoveredEra(index)}
                          onMouseLeave={() => setHoveredEra(null)}
                        />
                        <text
                          x={50 + (index * 150)}
                          y={isHovered ? "35" : "40"}
                          textAnchor="middle"
                          fill="#F5F4F2"
                          fontSize="12"
                          fontWeight="bold"
                          style={{ transition: 'all 0.2s' }}
                        >
                          {era.era}
                        </text>
                        <text
                          x={50 + (index * 150)}
                          y={isHovered ? "90" : "85"}
                          textAnchor="middle"
                          fill="#9CA3AF"
                          fontSize="10"
                          style={{ transition: 'all 0.2s' }}
                        >
                          {era.year < 0 ? `${Math.abs(era.year)} BCE` : `${era.year} CE`}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Era details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {wordData.drift.map((era, index) => (
                  <div 
                    key={index}
                    style={{
                      backgroundColor: hoveredEra === index ? '#141419' : 'transparent',
                      borderRadius: '8px',
                      padding: '16px',
                      border: '1px solid',
                      borderColor: hoveredEra === index ? era.color : 'transparent',
                      transition: 'all 0.3s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={() => setHoveredEra(index)}
                    onMouseLeave={() => setHoveredEra(null)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: era.color
                      }} />
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: era.color 
                      }}>
                        {era.era}
                      </span>
                      <span style={{ color: '#6B7280' }}>
                        ({era.year < 0 ? `${Math.abs(era.year)} BCE` : `${era.year} CE`})
                      </span>
                    </div>
                    <p style={{ 
                      color: '#F5F4F2', 
                      marginBottom: '8px',
                      fontSize: '15px'
                    }}>
                      {era.meaning}
                    </p>
                    
                    {/* Confidence bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: '#9CA3AF', fontSize: '14px', minWidth: '80px' }}>
                        Confidence:
                      </span>
                      <div style={{ 
                        flex: 1, 
                        height: '8px', 
                        backgroundColor: '#141419', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          backgroundColor: era.color,
                          width: animatedBars ? `${era.confidence}%` : '0%',
                          borderRadius: '4px',
                          transition: 'width 1s ease-out',
                          transitionDelay: `${index * 0.2}s`
                        }} />
                      </div>
                      <span style={{ 
                        color: era.color, 
                        fontWeight: 'bold',
                        minWidth: '40px',
                        fontSize: '14px'
                      }}>
                        {era.confidence}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insight Panel */}
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '12px', 
              padding: '24px',
              border: '1px solid #C9A227'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: '#C9A227',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>💡</span>
                LOGOS Insight
              </h3>
              <p style={{ 
                color: '#F5F4F2', 
                lineHeight: '1.6',
                fontSize: '15px'
              }}>
                {wordData.insight}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}