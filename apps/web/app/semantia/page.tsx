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
      { sigla: "Laur. plut. 32.16", reading: "σῶμα", date: "10th c. CE", confidence: 90 }
    ],
    embedding: [
      { x: 25, y: 90, era: "Archaic", color: "#D97706" },
      { x: 50, y: 55, era: "Classical", color: "#F59E0B" },
      { x: 75, y: 35, era: "Hellenistic", color: "#3B82F6" },
      { x: 95, y: 20, era: "Late Antique", color: "#7C3AED" }
    ],
    lsj: {
      definition: "the body, whether of men or animals, living or dead; a living body, opposed to the soul; a dead body, corpse",
      etymology: "perhaps connected with σαόω (to save, keep safe)",
      cognates: ["σῶστρος", "σωτήρ"]
    }
  }
};


const ERA_COLORS = {
  "Archaic": "#D97706",
  "Classical": "#F59E0B",
  "Hellenistic": "#3B82F6",
  "Imperial": "#DC2626",
  "Late Antique": "#7C3AED",
  "Byzantine": "#059669"
};


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const WordDetailPage = () => {
  const [selectedWord, setSelectedWord] = useState<string>('λόγος');
  const wordData = WORDS[selectedWord];
  const [hoveredEra, setHoveredEra] = useState<string | null>(null);

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
  };


  const handleEraHover = (era: string | null) => {
    setHoveredEra(era);
  };


  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <header style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#C9A227', transition: 'color 0.3s' }}>
          <span style={{ color: '#F5F4F2' }}>LOGOS</span> Professional Design System
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '1.1rem', transition: 'color 0.3s' }}>
          A semantic journey through ancient Greek words
        </p>
      </header>

      <main style={{ width: '90%', maxWidth: '1200px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '20px' }}>
        {/* Word List (Left Sidebar) */}
        <aside style={{ width: '25%', backgroundColor: '#1E1E24', borderRadius: '8px', padding: '15px', transition: 'background-color 0.3s', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 'semibold', color: '#F5F4F2', marginBottom: '10px', borderBottom: '1px solid #6B7280', paddingBottom: '5px' }}>
            Words <span style={{color: '#C9A227'}}>Catalog</span>
          </h2>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {Object.keys(WORDS).map((word) => (
              <li key={word} style={{ marginBottom: '8px', cursor: 'pointer', transition: 'color 0.3s, transform 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                onClick={() => handleWordClick(word)}
                onMouseEnter={() => handleEraHover(word)}
                onMouseLeave={() => handleEraHover(null)}
              >
                <span style={{ color: selectedWord === word ? '#C9A227' : '#9CA3AF', fontWeight: selectedWord === word ? 'bold' : 'normal' }}>
                  {word}
                </span>
                <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>{WORDS[word].translit}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Word Details (Main Content) */}
        <section style={{ width: '70%', backgroundColor: '#1E1E24', borderRadius: '8px', padding: '20px', transition: 'background-color 0.3s', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
          {wordData && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '5px' }}>
                    {wordData.word} <span style={{ fontSize: '1.2rem', color: '#9CA3AF' }}>({wordData.translit})</span>
                  </h2>
                  <p style={{ color: '#9CA3AF', fontSize: '1.1rem' }}>
                    Traditional meaning: <span style={{ color: '#C9A227' }}>{wordData.traditional}</span>
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Corpus Count:</span>
                  <span style={{ color: '#F5F4F2', fontWeight: 'bold' }}>{wordData.count}</span>
                </div>
              </div>

              {/* Semantic Drift Visualization */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '10px', borderBottom: '1px solid #6B7280', paddingBottom: '5px' }}>
                  Semantic Drift
                </h3>
                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                  <svg width="100%" height="100%">
                    {wordData.embedding.map((point, index) => (
                      <circle
                        key={index}
                        cx={`${point.x}%`}
                        cy={`${point.y}%`}
                        r="8"
                        fill={point.color}
                        opacity={hoveredEra === null || hoveredEra === point.era ? 1 : 0.3}
                        style={{ transition: 'opacity 0.3s, transform 0.2s' }}
                        onMouseEnter={() => handleEraHover(point.era)}
                        onMouseLeave={() => handleEraHover(null)}
                      />
                    ))}
                    {wordData.embedding.map((point, index) => (
                      <text
                        key={`text-${index}`}
                        x={`${point.x}%`}
                        y={`${point.y}%`}
                        dx="12"
                        dy="4"
                        fontSize="0.8rem"
                        fill="#9CA3AF"
                        opacity={hoveredEra === null || hoveredEra === point.era ? 1 : 0.3}
                        style={{ transition: 'opacity 0.3s' }}
                        onMouseEnter={() => handleEraHover(point.era)}
                        onMouseLeave={() => handleEraHover(null)}
                      >
                        {point.era}
                      </text>
                    ))}
                  </svg>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '1rem', marginTop: '10px' }}>
                  {wordData.corpus}
                </p>
              </div>

              {/* Semantic Drift Table */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '10px', borderBottom: '1px solid #6B7280', paddingBottom: '5px' }}>
                  Semantic Drift Details
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#141419' }}>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#9CA3AF' }}>Era</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#9CA3AF' }}>Meaning</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#9CA3AF' }}>Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wordData.drift.map((d, index) => (
                      <tr key={index} style={{ backgroundColor: hoveredEra === null || hoveredEra === d.era ? 'transparent' : '#141419', transition: 'background-color 0.3s' }}
                        onMouseEnter={() => handleEraHover(d.era)}
                        onMouseLeave={() => handleEraHover(null)}
                      >
                        <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#F5F4F2' }}>
                          <span style={{ color: d.color, fontWeight: 'bold' }}>{d.era}</span>
                        </td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#9CA3AF' }}>{d.meaning}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#9CA3AF' }}>{d.year} BCE</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Insight */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '10px', borderBottom: '1px solid #6B7280', paddingBottom: '5px' }}>
                  Key Insight
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '1.1rem', fontStyle: 'italic' }}>
                  {wordData.insight}
                </p>
              </div>

              {/* Paradigm */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '10px', borderBottom: '1px solid #6B7280', paddingBottom: '5px' }}>
                  Paradigm
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#141419' }}>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#9CA3AF' }}>Form</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#9CA3AF' }}>Greek</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#9CA3AF' }}>Function</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wordData.paradigm.map((p, index) => (
                      <tr key={index}>
                        <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#9CA3AF' }}>{p.form}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#F5F4F2' }}>{p.greek}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#9CA3AF' }}>{p.function}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Manuscripts */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '10px', borderBottom: '1px solid #6B7280', paddingBottom: '5px' }}>
                  Manuscript Attestations
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#141419' }}>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#9CA3AF' }}>Sigla</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#9CA3AF' }}>Reading</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#9CA3AF' }}>Date</th>
                      {/* <th style={{ padding: '8px', textAlign: 'left', color: '#9CA3AF' }}>Confidence</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {wordData.manuscripts.map((m, index) => (
                      <tr key={index}>
                        <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#9CA3AF' }}>{m.sigla}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#F5F4F2' }}>{m.reading}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#9CA3AF' }}>{m.date}</td>
                        {/* <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#9CA3AF' }}>{m.confidence}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* LSJ Definition */}
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '10px', borderBottom: '1px solid #6B7280', paddingBottom: '5px' }}>
                  LSJ Definition
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '1.1rem' }}>
                  {wordData.lsj.definition}
                </p>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '10px' }}>
                  Etymology: {wordData.lsj.etymology}
                </p>
                <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                  Cognates: {wordData.lsj.cognates.join(', ')}
                </p>
              </div>
            </>
          )}
        </section>
      </main>
      <footer style={{ marginTop: '30px', textAlign: 'center', color: '#6B7280', fontSize: '0.9rem' }}>
        © 2024 LOGOS Project. All rights reserved.
      </footer>
    </div>
  );
};

export default WordDetailPage;