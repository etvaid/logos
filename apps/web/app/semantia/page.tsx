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
  paradigm: { form: string; greek: string; function: string }[];
  manuscripts: { sigla: string; reading: string; date: string; confidence: number }[];
  embedding: { x: number; y: number; era: string; color: string }[];
  lsj: { definition: string; etymology: string; cognates: string[] };
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
    insight: "LSJ misses the crucial shift from Homeric 'battle prowess' to Platonic 'moral virtue'. LOGOS corpus shows ἀρετή meant physical excellence 78% of the time in archaic texts, vs only 12% in classical philosophy.",
    paradigm: [
      { form: "Nom. Sg.", greek: "ἀρετή", function: "Subject" },
      { form: "Gen. Sg.", greek: "ἀρετῆς", function: "Possession" },
      { form: "Dat. Sg.", greek: "ἀρετῇ", function: "Indirect object" },
      { form: "Acc. Sg.", greek: "ἀρετήν", function: "Direct object" }
    ],
    manuscripts: [
      { sigla: "P.Oxy. 1806", reading: "ἀρετή", date: "3rd c. CE", confidence: 96 },
      { sigla: "Vat. gr. 1", reading: "ἀρεταί", date: "10th c. CE", confidence: 89 },
      { sigla: "Marc. gr. 454", reading: "ἀρετῆς", date: "15th c. CE", confidence: 92 }
    ],
    embedding: [
      { x: 20, y: 80, era: "Archaic", color: "#D97706" },
      { x: 45, y: 40, era: "Classical", color: "#F59E0B" },
      { x: 70, y: 60, era: "Hellenistic", color: "#3B82F6" },
      { x: 85, y: 30, era: "Late Antique", color: "#7C3AED" }
    ],
    lsj: { 
      definition: "goodness, excellence, of any kind esp. of manly qualities, manhood, valour, prowess",
      etymology: "from ἀρι- (intensive) + -ετή (abstract suffix)",
      cognates: ["ἄριστος", "ἀρείων", "ἀρετάω"]
    }
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
    insight: "The most dramatic semantic transformation in Greek. From Homer's 'story' to Heraclitus' 'cosmic principle' to John's 'divine Word' - this single term encapsulates the entire intellectual history of the ancient world.",
    paradigm: [
      { form: "Nom. Sg.", greek: "λόγος", function: "Subject" },
      { form: "Gen. Sg.", greek: "λόγου", function: "Possession" },
      { form: "Dat. Sg.", greek: "λόγῳ", function: "Indirect object" },
      { form: "Acc. Sg.", greek: "λόγον", function: "Direct object" }
    ],
    manuscripts: [
      { sigla: "P.Herc. 1673", reading: "λόγος", date: "1st c. BCE", confidence: 98 },
      { sigla: "Cod. Sinait.", reading: "λόγου", date: "4th c. CE", confidence: 95 },
      { sigla: "Par. gr. 1807", reading: "λόγον", date: "9th c. CE", confidence: 91 }
    ],
    embedding: [
      { x: 15, y: 70, era: "Archaic", color: "#D97706" },
      { x: 40, y: 45, era: "Classical", color: "#F59E0B" },
      { x: 65, y: 25, era: "Hellenistic", color: "#3B82F6" },
      { x: 90, y: 15, era: "Late Antique", color: "#7C3AED" }
    ],
    lsj: { 
      definition: "computation, reckoning; relation, proportion, analogy; explanation; inward debate of the soul; continuous statement, narrative; word, speech; reason",
      etymology: "from λέγω (to say, collect, count)",
      cognates: ["λέγω", "λεκτός", "διάλογος", "ἀνάλογος"]
    }
  },
  "σῶμα": {
    word: "σῶμα", translit: "sōma", traditional: "body",
    corpus: "corpse → living body → cosmic body → mystical body",
    count: 8924,
    drift: [
      { era: "Archaic", meaning: "Dead body, corpse", confidence: 89, color: "#D97706", year: -750 },
      { era: "Classical", meaning: "Living body, physical form", confidence: 93, color: "#F59E0B", year: -450 },
      { era: "Hellenistic", meaning: "Material substance, cosmic body", confidence: 87, color: "#3B82F6", year: -200 },
      { era: "Late Antique", meaning: "Church as mystical body", confidence: 91, color: "#7C3AED", year: 350 },
    ],
    insight: "Semantic broadening from death to life to cosmos. Homer's σῶμα is always a corpse; Plato's is the soul's prison; Paul's is Christ's mystical unity. The body's conceptual journey mirrors Greek thought itself.",
    paradigm: [
      { form: "Nom. Sg.", greek: "σῶμα", function: "Subject" },
      { form: "Gen. Sg.", greek: "σώματος", function: "Possession" },
      { form: "Dat. Sg.", greek: "σώματι", function: "Indirect object" },
      { form: "Acc. Sg.", greek: "σῶμα", function: "Direct object" }
    ],
    manuscripts: [
      { sigla: "P.Oxy. 3525", reading: "σῶμα", date: "2nd c. CE", confidence: 94 },
      { sigla: "Vat. gr. 2061", reading: "σώματος", date: "11th c. CE", confidence: 88 },
      { sigla: "Laur. plut. 32.16", reading: "σώματι", date: "13th c. CE", confidence: 92 }
    ],
    embedding: [
      { x: 10, y: 90, era: "Archaic", color: "#D97706" },
      { x: 35, y: 50, era: "Classical", color: "#F59E0B" },
      { x: 60, y: 30, era: "Hellenistic", color: "#3B82F6" },
      { x: 80, y: 20, era: "Late Antique", color: "#7C3AED" }
    ],
    lsj: { 
      definition: "dead body, corpse; the living body; body as opp. to soul; material substance",
      etymology: "related to σῴζω (to save, preserve)",
      cognates: ["σῴζω", "σωτήρ", "σωτηρία"]
    }
  }
};

export default function Semantia() {
  const [selectedWord, setSelectedWord] = useState("ἀρετή");
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'drift' | 'embedding' | 'manuscripts' | 'paradigm'>('drift');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentWord = WORDS[selectedWord];

  if (!mounted) return null;

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2',
      fontFamily: 'ui-serif, Georgia, serif'
    }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#141419', 
        borderBottom: '1px solid #1E1E24',
        padding: '1rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#C9A227',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}>
            ΛΟΓΟΣ
          </Link>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link href="/corpus" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>Corpus</Link>
            <Link href="/semantia" style={{ color: '#C9A227', textDecoration: 'none' }}>Semantia</Link>
            <Link href="/codex" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>Codex</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            marginBottom: '0.5rem', 
            background: 'linear-gradient(135deg, #C9A227, #F59E0B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            ΣΗΜΑΝΤΙΑ
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto' }}>
            Semantic Drift Analysis • Diachronic Word Embeddings • Critical Apparatus Integration
          </p>
        </div>

        {/* Word Selector */}
        <div style={{ 
          backgroundColor: '#1E1E24', 
          border: '1px solid #2A2A32',
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#C9A227' }}>
            Lexeme Selection
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {Object.entries(WORDS).map(([word, data]) => (
              <button
                key={word}
                onClick={() => setSelectedWord(word)}
                style={{
                  backgroundColor: selectedWord === word ? '#C9A227' : '#141419',
                  color: selectedWord === word ? '#0D0D0F' : '#F5F4F2',
                  border: selectedWord === word ? '2px solid #C9A227' : '2px solid #2A2A32',
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  transform: selectedWord === word ? 'translateY(-2px)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedWord !== word) {
                    e.currentTarget.style.borderColor = '#C9A227';
                    e.currentTarget.style.backgroundColor = '#1A1A20';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedWord !== word) {
                    e.currentTarget.style.borderColor = '#2A2A32';
                    e.currentTarget.style.backgroundColor = '#141419';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ 
                    backgroundColor: '#3B82F6', 
                    color: 'white', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold' 
                  }}>
                    Α
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'serif' }}>{data.word}</span>
                  <span style={{ fontSize: '1rem', color: '#9CA3AF', fontStyle: 'italic' }}>({data.translit})</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: selectedWord === word ? '#0D0D0F' : '#9CA3AF', marginBottom: '0.5rem' }}>
                  {data.corpus}
                </div>
                <div style={{ fontSize: '0.8rem', color: selectedWord === word ? '#0D0D0F' : '#6B7280' }}>
                  {data.count.toLocaleString()} attestations
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Word Display */}
        <div style={{ 
          backgroundColor: '#1E1E24', 
          border: '1px solid #2A2A32',
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ 
              backgroundColor: '#3B82F6', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '6px', 
              fontSize: '0.875rem', 
              fontWeight: 'bold' 
            }}>
              Α
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'serif' }}>
              {currentWord.word}
            </h2>
            <span style={{ fontSize: '1.5rem', color: '#9CA3AF', fontStyle: 'italic' }}>
              ({currentWord.translit})
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <h3 style={{ color: '#C9A227', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Traditional Gloss
              </h3>
              <p style={{ color: '#F5F4F2' }}>{currentWord.traditional}</p>
            </div>
            <div>
              <h3 style={{ color: '#C9A227', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Semantic Evolution
              </h3>
              <p style={{ color: '#F5F4F2' }}>{currentWord.corpus}</p>
            </div>
            <div>
              <h3 style={{ color: '#C9A227', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Corpus Frequency
              </h3>
              <p style={{ color: '#F5F4F2' }}>{currentWord.count.toLocaleString()} attestations</p>
            </div>
          </div>
        </div>

        {/* Analysis Tabs */}
        <div style={{ 
          backgroundColor: '#1E1E24', 
          border: '1px solid #2A2A32',
          borderRadius: '12px', 
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #2A2A32',
            backgroundColor: '#141419'
          }}>
            {[
              { key: 'drift', label: 'Diachronic Analysis', icon: '📈' },
              { key: 'embedding', label: 'Semantic Space', icon: '🗺️' },
              { key: 'manuscripts', label: 'Critical Apparatus', icon: '📜' },
              { key: 'paradigm', label: 'Morphological Data', icon: '📋' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: activeTab === tab.key ? '#1E1E24' : 'transparent',
                  color: activeTab === tab.key ? '#C9A227' : '#9CA3AF',
                  border: 'none',
                  borderBottom: activeTab === tab.key ? '2px solid #C9A227' : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.key) {
                    e.currentTarget.style.color = '#F5F4F2';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.key) {
                    e.currentTarget.style.color = '#9CA3AF';
                  }
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '2rem' }}>
            {/* Drift Timeline */}
            {activeTab === 'drift' && (
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#C9A227' }}>
                  Semantic Drift Timeline
                </h3>
                
                {/* Timeline Visualization */}
                <div style={{ marginBottom: '3rem' }}>
                  <svg width="100%" height="200" style={{ backgroundColor: '#141419', borderRadius: '8px' }}>
                    {/* Timeline line */}
                    <line x1="50" y1="100" x2="950" y2="100" stroke="#2A2A32" strokeWidth="2" />
                    
                    {/* Era points and connections */}
                    {currentWord.drift.map((point, index) => {
                      const x = 50 + (index * 225);
                      const isHovered = hoveredPoint === index;
                      
                      return (
                        <g key={index}>
                          {/* Connection line to next point */}
                          {index < currentWord.drift.length - 1 && (
                            <line 
                              x1={x} 
                              y1="100" 
                              x2={50 + ((index + 1) * 225)} 
                              y2="100" 
                              stroke={point.color} 
                              strokeWidth="3" 
                              opacity="0.6"
                            />
                          )}
                          
                          {/* Era point */}
                          <circle
                            cx={x}
                            cy="100"
                            r={isHovered ? "12" : "8"}
                            fill={point.color}
                            stroke="#F5F4F2"
                            strokeWidth={isHovered ? "3" : "2"}
                            style={{ 
                              cursor: 'pointer',
                              transition: 'all 0.3s'
                            }}
                            onMouseEnter={() => setHoveredPoint(index)}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                          
                          {/* Era label */}
                          <text
                            x={x}
                            y="130"
                            textAnchor="middle"
                            fill={point.color}
                            fontSize="12"
                            fontWeight="bold"
                          >
                            {point.era}
                          </text>
                          
                          {/* Year */}
                          <text
                            x={x}
                            y="145"
                            textAnchor="middle"
                            fill="#9CA3AF"
                            fontSize="10"
                          >
                            {point.year > 0 ? `${point.year} CE` : `${Math.abs(point.year)} BCE`}
                          </text>
                          
                          {/* Confidence indicator */}
                          <rect
                            x={x - 15}
                            y="70"
                            width="30"
                            height="4"
                            fill="#2A2A32"
                            rx="2"
                          />
                          <rect
                            x={x - 15}
                            y="70"
                            width={30 * (point.confidence / 100)}
                            height="4"
                            fill={point.color}
                            rx="2"
                          />
                          
                          {/* Hover tooltip */}
                          {isHovered && (
                            <g>
                              <rect
                                x={x - 100}
                                y="20"
                                width="200"
                                height="40"
                                fill="#0D0D0F"
                                stroke={point.color}
                                strokeWidth="1"
                                rx="4"
                              />
                              <text
                                x={x}
                                y="35"
                                textAnchor="middle"
                                fill="#F5F4F2"
                                fontSize="11"
                                fontWeight="bold"
                              >
                                {point.meaning}
                              </text>
                              <text
                                x={x}
                                y="50"
                                textAnchor="middle"
                                fill="#9CA3AF"
                                fontSize="10"
                              >
                                Confidence: {point.confidence}%
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Confidence Bars */}
                <div>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#F5F4F2' }}>
                    Semantic Confidence by Era
                  </h4>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {currentWord.drift.map((point, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          width: '120px', 
                          fontSize: '0.875rem', 
                          color: point.color,
                          fontWeight: 'bold'
                        }}>
                          {point.era}
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ 
                            flex: 1,
                            height: '20px',
                            backgroundColor: '#2A2A32',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            position: 'relative'
                          }}>
                            <div
                              style={{
                                width: `${point.confidence}%`,
                                height: '100%',
                                backgroundColor: point.color,
                                borderRadius: '10px',
                                transition: 'width 1s ease-out'
                              }}
                            />
                          </div>
                          <div style={{ 
                            width: '50px', 
                            fontSize: '0.875rem', 
                            color: '#F5F4F2',
                            fontWeight: 'bold',
                            textAlign: 'right'
                          }}>
                            {point.confidence}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Word Embeddings Visualization */}
            {activeTab === 'embedding' && (
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#C9A227' }}>
                  Diachronic Word Embeddings
                </h3>
                <p style={{ color: '#9CA3AF', marginBottom: '2rem' }}>
                  2D projection of high-dimensional semantic space. Distance represents semantic similarity in each era.
                </p>
                
                <div style={{ backgroundColor: '#141419', borderRadius: '8px', padding: '1rem' }}>
                  <svg width="100%" height="400">
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map(i => (
                      <g key={i}>
                        <line x1={i * 200} y1="0" x2={i * 200} y2="400" stroke="#2A2A32" strokeWidth="1" opacity="0.3" />
                        <line x1="0" y1={i * 100} x2="800" y2={i * 100} stroke="#2A2A32" strokeWidth="1" opacity="0.3" />
                      </g>
                    ))}
                    
                    {/* Trajectory line */}
                    {currentWord.embedding.slice(0, -1).map((point, index) => {
                      const nextPoint = currentWord.embedding[index + 1];
                      return (
                        <line
                          key={index}
                          x1={point.x * 8}
                          y1={point.y * 4}
                          x2={nextPoint.x * 8}
                          y2={nextPoint.y * 4}
                          stroke="#C9A227"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          opacity="0.7"
                        />
                      );
                    })}
                    
                    {/* Embedding points */}
                    {currentWord.embedding.map((point, index) => (
                      <g key={index}>
                        <circle
                          cx={point.x * 8}
                          cy={point.y * 4}
                          r="8"
                          fill={point.color}
                          stroke="#F5F4F2"
                          strokeWidth="2"
                        />
                        <text
                          x={point.x * 8}
                          y={point.y * 4 - 15}
                          textAnchor="middle"
                          fill={point.color}
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {point.era}
                        </text>
                      </g>
                    ))}
                    
                    {/* Axes labels */}
                    <text x="400" y="390" textAnchor="middle" fill="#9CA3AF" fontSize="12">
                      Semantic Dimension 1 (Abstract ← → Concrete)
                    </text>
                    <text x="15" y="200" textAnchor="middle" fill="#9CA3AF" fontSize="12" transform="rotate(-90, 15, 200)">
                      Semantic Dimension 2 (Divine ← → Human)
                    </text>
                  </svg>
                </div>
              </div>
            )}

            {/* Critical Apparatus */}
            {activeTab === 'manuscripts' && (
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#C9A227' }}>
                  Critical Apparatus & Manuscript Variants
                </h3>
                
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {currentWord.manuscripts.map((ms, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: '#141419',
                        border: '1px solid #2A2A32',
                        borderRadius: '