'use client';

import { useState, useEffect, useRef } from 'react';
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
      { sigla: "Laur. plut. 32.16", reading: "σῶμα", date: "12th c. CE", confidence: 90 }
    ],
    embedding: [
      { x: 10, y: 90, era: "Archaic", color: "#D97706" },
      { x: 35, y: 55, era: "Classical", color: "#F59E0B" },
      { x: 60, y: 35, era: "Hellenistic", color: "#3B82F6" },
      { x: 80, y: 20, era: "Late Antique", color: "#7C3AED" }
    ],
    lsj: {
      definition: "the body whether of men or animals, living or dead",
      etymology: "Uncertain",
      cognates: []
    }
  }
};

const EraColors: Record<string, string> = {
  "Archaic": "#D97706",
  "Classical": "#F59E0B",
  "Hellenistic": "#3B82F6",
  "Imperial": "#DC2626",
  "Late Antique": "#7C3AED",
  "Byzantine": "#059669",
};

export default function Home() {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const wordData = selectedWord ? WORDS[selectedWord] : null;

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', padding: '20px', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      <header style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#C9A227', transition: 'color 0.3s ease' }}>
          Logos Lexicon
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '1.2rem', transition: 'color 0.3s ease' }}>
          Exploring the Evolution of Ancient Greek Words
        </p>
      </header>

      <main style={{ display: 'flex', gap: '20px' }}>
        <aside style={{ width: '250px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#F5F4F2', transition: 'color 0.3s ease' }}>
            Words
          </h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {Object.keys(WORDS).map(word => (
              <li key={word} style={{ marginBottom: '8px' }}>
                <button
                  onClick={() => setSelectedWord(word)}
                  style={{
                    backgroundColor: '#1E1E24',
                    color: '#F5F4F2',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                    ...(selectedWord === word ? { backgroundColor: '#C9A227', color: '#0D0D0F' } : {})
                  }}
                >
                  {word} <span style={{color:'#9CA3AF'}}>Α</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <article style={{ flex: 1 }}>
          {wordData ? (
            <div style={{ backgroundColor: '#1E1E24', padding: '20px', borderRadius: '10px', transition: 'background-color 0.3s ease' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px', color: '#F5F4F2', transition: 'color 0.3s ease' }}>
                {wordData.word} <span style={{color:'#9CA3AF'}}>Α</span> ({wordData.translit})
              </h2>
              <p style={{ color: '#9CA3AF', marginBottom: '15px', transition: 'color 0.3s ease' }}>
                Traditional Meaning: {wordData.traditional}
              </p>

              <section style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                  Corpus Evolution
                </h3>
                <p style={{ color: '#9CA3AF', transition: 'color 0.3s ease' }}>
                  {wordData.corpus}
                </p>
              </section>

              <section style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                  Semantic Drift
                </h3>
                <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', borderCollapse: 'collapse', minWidth:'600px'}}>
                  <thead>
                    <tr style={{backgroundColor: '#141419', color: '#F5F4F2'}}>
                      <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #6B7280'}}>Era</th>
                      <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #6B7280'}}>Meaning</th>
                      <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #6B7280'}}>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wordData.drift.map((d, index) => (
                      <tr key={index} style={{transition: 'background-color 0.2s ease'}}>
                        <td style={{padding: '8px', borderBottom: '1px solid #6B7280', color:d.color}}>{d.era}</td>
                        <td style={{padding: '8px', borderBottom: '1px solid #6B7280', color: '#9CA3AF'}}>{d.meaning}</td>
                        <td style={{padding: '8px', borderBottom: '1px solid #6B7280', color: '#9CA3AF'}}>{d.confidence}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </section>

              <section style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                  Key Insight
                </h3>
                <p style={{ color: '#9CA3AF', transition: 'color 0.3s ease' }}>
                  {wordData.insight}
                </p>
              </section>

              <section style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                  Paradigm
                </h3>
                <div style={{overflowX: 'auto'}}>
                 <table style={{width: '100%', borderCollapse: 'collapse', minWidth:'400px'}}>
                    <thead>
                      <tr style={{backgroundColor: '#141419', color: '#F5F4F2'}}>
                        <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #6B7280'}}>Form</th>
                        <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #6B7280'}}>Greek</th>
                        <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #6B7280'}}>Function</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wordData.paradigm.map((p, index) => (
                        <tr key={index} style={{transition: 'background-color 0.2s ease'}}>
                          <td style={{padding: '8px', borderBottom: '1px solid #6B7280', color: '#9CA3AF'}}>{p.form}</td>
                          <td style={{padding: '8px', borderBottom: '1px solid #6B7280', color: '#F5F4F2'}}>{p.greek} <span style={{color:'#9CA3AF'}}>Α</span></td>
                          <td style={{padding: '8px', borderBottom: '1px solid #6B7280', color: '#9CA3AF'}}>{p.function}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                  Manuscript Evidence
                </h3>
                 <div style={{overflowX: 'auto'}}>
                 <table style={{width: '100%', borderCollapse: 'collapse', minWidth:'500px'}}>
                    <thead>
                      <tr style={{backgroundColor: '#141419', color: '#F5F4F2'}}>
                        <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #6B7280'}}>Sigla</th>
                        <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #6B7280'}}>Reading</th>
                        <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #6B7280'}}>Date</th>
                        <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #6B7280'}}>Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wordData.manuscripts.map((m, index) => (
                        <tr key={index} style={{transition: 'background-color 0.2s ease'}}>
                          <td style={{padding: '8px', borderBottom: '1px solid #6B7280', color: '#9CA3AF'}}>{m.sigla}</td>
                          <td style={{padding: '8px', borderBottom: '1px solid #6B7280', color: '#F5F4F2'}}>{m.reading} <span style={{color:'#9CA3AF'}}>Α</span></td>
                          <td style={{padding: '8px', borderBottom: '1px solid #6B7280', color: '#9CA3AF'}}>{m.date}</td>
                          <td style={{padding: '8px', borderBottom: '1px solid #6B7280', color: '#9CA3AF'}}>{m.confidence}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                  Semantic Embedding
                </h3>
                <svg width="300" height="200" style={{border: '1px solid #6B7280'}}>
                  {wordData.embedding.map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      fill={point.color}
                      style={{ transition: 'fill 0.3s ease' }}
                    />
                  ))}
                </svg>
              </section>

              <section>
                <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                  LSJ Definition
                </h3>
                <p style={{ color: '#9CA3AF', transition: 'color 0.3s ease' }}>
                  Definition: {wordData.lsj.definition}
                  <br />
                  Etymology: {wordData.lsj.etymology}
                  <br />
                  Cognates: {wordData.lsj.cognates.join(', ')}
                </p>
              </section>
            </div>
          ) : (
            <p style={{ color: '#9CA3AF', transition: 'color 0.3s ease' }}>
              Select a word to see its details.
            </p>
          )}
        </article>
      </main>

      <footer style={{ marginTop: '30px', textAlign: 'center', color: '#6B7280', transition: 'color 0.3s ease' }}>
        <p>
          &copy; 2024 Logos Lexicon. All rights reserved.
        </p>
      </footer>
    </div>
  );
}