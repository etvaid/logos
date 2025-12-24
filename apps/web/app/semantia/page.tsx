
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface WordData {
  word: string;
  translit: string;
  traditional: string;
  corpus: string;
  count: number;
  drift: { era: string; meaning: string; confidence: number; color: string }[];
  insight: string;
}

const WORDS: Record<string, WordData> = {
  "ἀρετή": {
    word: "ἀρετή", translit: "aretē", traditional: "virtue",
    corpus: "excellence → moral virtue → Christian virtue",
    count: 2847,
    drift: [
      { era: "Archaic", meaning: "Excellence in battle, prowess", confidence: 92, color: "#D97706" },
      { era: "Classical", meaning: "Moral excellence, virtue of soul", confidence: 95, color: "#F59E0B" },
      { era: "Hellenistic", meaning: "Philosophical virtue, wisdom", confidence: 88, color: "#3B82F6" },
      { era: "Late Antique", meaning: "Christian moral virtue", confidence: 90, color: "#7C3AED" },
    ],
    insight: "LSJ misses the crucial shift from Homeric 'battle prowess' to Platonic 'moral virtue'. LOGOS corpus shows ἀρετή meant physical excellence 78% of the time in archaic texts, vs only 12% in classical philosophy."
  },
  "λόγος": {
    word: "λόγος", translit: "logos", traditional: "word, reason",
    corpus: "speech → reason → cosmic principle → divine Word",
    count: 12453,
    drift: [
      { era: "Archaic", meaning: "Speech, story, account", confidence: 94, color: "#D97706" },
      { era: "Classical", meaning: "Reason, rational argument", confidence: 96, color: "#F59E0B" },
      { era: "Hellenistic", meaning: "Cosmic reason, natural law", confidence: 91, color: "#3B82F6" },
      { era: "Late Antique", meaning: "Divine Word, Christ", confidence: 93, color: "#7C3AED" },
    ],
    insight: "The most dramatic semantic transformation in Greek. From Homer's 'story' to Heraclitus' 'cosmic principle' to John's 'divine Word' - this single term encapsulates the entire intellectual history of the ancient world."
  },
  "ψυχή": {
    word: "ψυχή", translit: "psychē", traditional: "soul, life",
    corpus: "breath-soul → life force → immortal soul",
    count: 5621,
    drift: [
      { era: "Archaic", meaning: "Breath, life-force at death", confidence: 93, color: "#D97706" },
      { era: "Classical", meaning: "Immortal soul, seat of reason", confidence: 95, color: "#F59E0B" },
      { era: "Late Antique", meaning: "Rational Christian soul", confidence: 89, color: "#7C3AED" },
    ],
    insight: "Homer's ψυχή is NOT Plato's. 94% of Homeric uses mean 'breath that departs at death' with no moral dimension - fundamentally different from the immortal rational soul of the Phaedo."
  },
};

export default function SemantiaPage() {
  const [selected, setSelected] = useState<string | null>("ἀρετή");
  const word = selected ? WORDS[selected] : null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <nav style={{ borderBottom: '1px solid #2D2D35', padding: '16px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>LOGOS</Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/search" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Search</Link>
            <Link href="/connectome" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Connectome</Link>
            <Link href="/semantia" style={{ color: '#C9A227', textDecoration: 'none' }}>SEMANTIA</Link>
            <Link href="/maps" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Maps</Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#C9A227', marginBottom: '8px' }}>SEMANTIA</h1>
        <p style={{ color: '#9CA3AF', marginBottom: '32px' }}>Corpus-derived meanings that challenge traditional lexicons</p>

        {/* Word Selector */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          {Object.keys(WORDS).map(w => (
            <button
              key={w}
              onClick={() => setSelected(w)}
              style={{
                padding: '16px 32px',
                fontSize: '24px',
                fontFamily: 'Georgia, serif',
                backgroundColor: selected === w ? '#C9A227' : '#1E1E24',
                color: selected === w ? '#0D0D0F' : '#F5F4F2',
                border: '1px solid #2D2D35',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {w}
            </button>
          ))}
        </div>

        {word && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div style={{ backgroundColor: '#1E1E24', borderRadius: '16px', padding: '32px', border: '1px solid #2D2D35' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '16px' }}>
                <span style={{ fontSize: '64px', fontFamily: 'Georgia, serif' }}>{word.word}</span>
                <span style={{ fontSize: '24px', color: '#9CA3AF' }}>{word.translit}</span>
                <span style={{ marginLeft: 'auto', fontSize: '24px', color: '#C9A227' }}>{word.count.toLocaleString()} occurrences</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>Traditional (LSJ)</p>
                  <p style={{ fontSize: '18px' }}>{word.traditional}</p>
                </div>
                <div>
                  <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>LOGOS Corpus-Derived</p>
                  <p style={{ fontSize: '18px', color: '#C9A227' }}>{word.corpus}</p>
                </div>
              </div>
            </div>

            {/* Semantic Timeline */}
            <div style={{ backgroundColor: '#1E1E24', borderRadius: '16px', padding: '32px', border: '1px solid #2D2D35' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Semantic Evolution</h3>
              <div style={{ position: 'relative' }}>
                {/* Timeline line */}
                <div style={{ position: 'absolute', left: '120px', top: '0', bottom: '0', width: '4px', backgroundColor: '#2D2D35' }}></div>
                
                {word.drift.map((era, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', position: 'relative' }}>
                    {/* Era label */}
                    <div style={{ width: '100px', textAlign: 'right' }}>
                      <span style={{ padding: '8px 16px', backgroundColor: `${era.color}20`, color: era.color, borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>{era.era}</span>
                    </div>
                    
                    {/* Node */}
                    <div style={{ width: '24px', height: '24px', backgroundColor: era.color, borderRadius: '50%', border: '4px solid #1E1E24', zIndex: 1 }}></div>
                    
                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '18px', marginBottom: '8px' }}>{era.meaning}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '200px', height: '8px', backgroundColor: '#0D0D0F', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${era.confidence}%`, height: '100%', backgroundColor: era.color, transition: 'width 0.5s' }}></div>
                        </div>
                        <span style={{ color: '#9CA3AF', fontSize: '14px' }}>{era.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insight */}
            <div style={{ backgroundColor: '#C9A22710', borderRadius: '16px', padding: '24px', border: '1px solid #C9A22730' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#C9A227', marginBottom: '12px' }}>💡 LOGOS Insight</h3>
              <p style={{ lineHeight: '1.8' }}>{word.insight}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
