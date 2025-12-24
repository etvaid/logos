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
  }
};

export default function SemantiaPage() {
  const [selected, setSelected] = useState<string>("ἀρετή");
  const [hoveredEra, setHoveredEra] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [animatingCount, setAnimatingCount] = useState(false);
  const [currentCount, setCurrentCount] = useState(2847);
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  const word = WORDS[selected];
  const filteredWords = Object.keys(WORDS).filter(w => 
    w.toLowerCase().includes(searchTerm.toLowerCase()) || 
    WORDS[w].translit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animate count when word changes
  useEffect(() => {
    if (word) {
      setAnimatingCount(true);
      let start = 0;
      const end = word.count;
      const duration = 1000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        setCurrentCount(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setAnimatingCount(false);
        }
      };
      animate();
    }
  }, [selected]);

  const handleWordSelect = (wordKey: string) => {
    setSelected(wordKey);
    setSelectedTimelineIndex(0);
    setSearchTerm("");
    setShowResults(false);
  };

  const handleTimelineClick = (index: number) => {
    setSelectedTimelineIndex(index);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setShowResults(value.length > 0);
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      {/* Navigation */}
      <nav style={{
        padding: '16px 32px',
        borderBottom: '1px solid #1E1E24',
        backgroundColor: '#0D0D0F'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>
            LOGOS
          </Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/reader" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'all 0.2s' }}>Reader</Link>
            <Link href="/semantia" style={{ color: '#C9A227', textDecoration: 'none' }}>Semantia</Link>
            <Link href="/morpheus" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'all 0.2s' }}>Morpheus</Link>
            <Link href="/syntaxis" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'all 0.2s' }}>Syntaxis</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#C9A227' }}>
            SEMANTIA
          </h1>
          <p style={{ fontSize: '20px', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto' }}>
            Track semantic evolution through time. See how Greek words transformed across eras.
          </p>
        </div>

        {/* Word Selector */}
        <div style={{ 
          backgroundColor: '#1E1E24', 
          borderRadius: '12px', 
          padding: '24px',
          marginBottom: '32px',
          position: 'relative'
        }}>
          <h3 style={{ color: '#C9A227', margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>
            Select Word
          </h3>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search for a word..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#141419',
                border: '1px solid #6B7280',
                borderRadius: '8px',
                color: '#F5F4F2',
                fontSize: '16px',
                transition: 'all 0.2s'
              }}
            />
            
            {/* Search Results Dropdown */}
            {showResults && filteredWords.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#1E1E24',
                border: '1px solid #6B7280',
                borderRadius: '8px',
                marginTop: '4px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 10
              }}>
                {filteredWords.map((wordKey) => (
                  <div
                    key={wordKey}
                    onClick={() => handleWordSelect(wordKey)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #141419',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#141419';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ color: '#F5F4F2', fontWeight: 'bold' }}>{wordKey}</div>
                    <div style={{ color: '#9CA3AF', fontSize: '14px' }}>
                      {WORDS[wordKey].translit} - {WORDS[wordKey].traditional}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Select Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
            {Object.keys(WORDS).map((wordKey) => (
              <button
                key={wordKey}
                onClick={() => handleWordSelect(wordKey)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: selected === wordKey ? '#C9A227' : '#141419',
                  color: selected === wordKey ? '#0D0D0F' : '#F5F4F2',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (selected !== wordKey) {
                    e.currentTarget.style.backgroundColor = '#E8D5A3';
                    e.currentTarget.style.color = '#0D0D0F';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selected !== wordKey) {
                    e.currentTarget.style.backgroundColor = '#141419';
                    e.currentTarget.style.color = '#F5F4F2';
                  }
                }}
              >
                {wordKey}
              </button>
            ))}
          </div>
        </div>

        {word && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {/* Left Column - Word Info & Timeline */}
            <div>
              {/* Current Word */}
              <div style={{ 
                backgroundColor: '#1E1E24', 
                borderRadius: '12px', 
                padding: '24px',
                marginBottom: '24px'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '48px', color: '#3B82F6', marginBottom: '8px' }}>
                    {word.word}
                  </div>
                  <div style={{ fontSize: '20px', color: '#9CA3AF', marginBottom: '8px' }}>
                    {word.translit}
                  </div>
                  <div style={{ fontSize: '16px', color: '#6B7280' }}>
                    Traditional: {word.traditional}
                  </div>
                </div>

                {/* Occurrence Counter */}
                <div style={{ 
                  textAlign: 'center', 
                  padding: '16px',
                  backgroundColor: '#141419',
                  borderRadius: '8px',
                  marginBottom: '24px'
                }}>
                  <div style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '4px' }}>
                    Corpus Occurrences
                  </div>
                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: 'bold', 
                    color: animatingCount ? '#C9A227' : '#F5F4F2',
                    transition: 'all 0.3s'
                  }}>
                    {currentCount.toLocaleString()}
                  </div>
                </div>

                {/* Semantic Evolution Path */}
                <div>
                  <h4 style={{ color: '#C9A227', margin: '0 0 12px 0', fontSize: '16px' }}>
                    Semantic Evolution
                  </h4>
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#141419',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#9CA3AF',
                    textAlign: 'center'
                  }}>
                    {word.corpus}
                  </div>
                </div>
              </div>

              {/* Semantic Timeline */}
              <div style={{ 
                backgroundColor: '#1E1E24', 
                borderRadius: '12px', 
                padding: '24px'
              }}>
                <h3 style={{ color: '#C9A227', margin: '0 0 24px 0', fontSize: '18px', fontWeight: 'bold' }}>
                  Semantic Timeline
                </h3>
                
                {/* Timeline Visualization */}
                <div style={{ position: 'relative', marginBottom: '24px' }}>
                  <svg width="100%" height="120" style={{ overflow: 'visible' }}>
                    {/* Timeline line */}
                    <line 
                      x1="50" 
                      y1="60" 
                      x2="450" 
                      y2="60" 
                      stroke="#6B7280" 
                      strokeWidth="2"
                    />
                    
                    {/* Era points */}
                    {word.drift.map((era, index) => {
                      const x = 50 + (index * (400 / (word.drift.length - 1)));
                      const isSelected = index === selectedTimelineIndex;
                      return (
                        <g key={era.era}>
                          <circle
                            cx={x}
                            cy="60"
                            r={isSelected ? "12" : "8"}
                            fill={era.color}
                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                            onClick={() => handleTimelineClick(index)}
                          />
                          <text
                            x={x}
                            y="85"
                            textAnchor="middle"
                            fill="#9CA3AF"
                            fontSize="12"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleTimelineClick(index)}
                          >
                            {era.era}
                          </text>
                          <text
                            x={x}
                            y="35"
                            textAnchor="middle"
                            fill="#6B7280"
                            fontSize="10"
                          >
                            {Math.abs(era.year)} {era.year < 0 ? 'BCE' : 'CE'}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Selected Era Details */}
                <div style={{
                  backgroundColor: '#141419',
                  borderRadius: '8px',
                  padding: '16px',
                  border: `2px solid ${word.drift[selectedTimelineIndex]?.color || '#6B7280'}`
                }}>
                  <div style={{ 
                    color: word.drift[selectedTimelineIndex]?.color || '#F5F4F2', 
                    fontWeight: 'bold',
                    marginBottom: '8px' 
                  }}>
                    {word.drift[selectedTimelineIndex]?.era} Era
                  </div>
                  <div style={{ color: '#F5F4F2', marginBottom: '12px' }}>
                    {word.drift[selectedTimelineIndex]?.meaning}
                  </div>
                  <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
                    Confidence: {word.drift[selectedTimelineIndex]?.confidence}%
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Confidence Bars & Insights */}
            <div>
              {/* Confidence Bars */}
              <div style={{ 
                backgroundColor: '#1E1E24', 
                borderRadius: '12px', 
                padding: '24px',
                marginBottom: '24px'
              }}>
                <h3 style={{ color: '#C9A227', margin: '0 0 24px 0', fontSize: '18px', fontWeight: 'bold' }}>
                  Era Transitions
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {word.drift.map((era, index) => (
                    <div key={era.era}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <span style={{ 
                          color: era.color, 
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}>
                          {era.era}
                        </span>
                        <span style={{ color: '#9CA3AF', fontSize: '14px' }}>
                          {era.confidence}%
                        </span>
                      </div>
                      
                      <div style={{
                        backgroundColor: '#141419',
                        borderRadius: '8px',
                        height: '8px',
                        overflow: 'hidden',
                        marginBottom: '8px'
                      }}>
                        <div
                          style={{
                            backgroundColor: era.color,
                            height: '100%',
                            width: `${era.confidence}%`,
                            transition: 'all 0.3s ease-out',
                            borderRadius: '8px'
                          }}
                        />
                      </div>
                      
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#6B7280',
                        marginBottom: '12px'
                      }}>
                        {era.meaning}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insight Panel */}
              <div style={{ 
                backgroundColor: '#1E1E24', 
                borderRadius: '12px', 
                padding: '24px'
              }}>
                <h3 style={{ color: '#C9A227', margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>
                  LOGOS Insight
                </h3>
                
                <div style={{
                  backgroundColor: '#141419',
                  borderRadius: '8px',
                  padding: '16px',
                  lineHeight: '1.6',
                  color: '#F5F4F2'
                }}>
                  {word.insight}
                </div>

                {/* Key Statistics */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginTop: '24px'
                }}>
                  <div style={{
                    backgroundColor: '#141419',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#C9A227', fontSize: '20px', fontWeight: 'bold' }}>
                      {word.drift.length}
                    </div>
                    <div style={{ color: '#9CA3AF', fontSize: '12px' }}>
                      Major Shifts
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: '#141419',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#C9A227', fontSize: '20px', fontWeight: 'bold' }}>
                      {Math.round(word.drift.reduce((sum, era) => sum + era.confidence, 0) / word.drift.length)}%
                    </div>
                    <div style={{ color: '#9CA3AF', fontSize: '12px' }}>
                      Avg. Confidence
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}