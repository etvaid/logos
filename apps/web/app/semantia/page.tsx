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
      { sigla: "Laur. plut. 32.16", reading: "σῶμα", date: "15th c. CE", confidence: 90 }
    ],
    embedding: [
      { x: 25, y: 65, era: "Archaic", color: "#D97706" },
      { x: 50, y: 50, era: "Classical", color: "#F59E0B" },
      { x: 75, y: 35, era: "Hellenistic", color: "#3B82F6" },
      { x: 95, y: 20, era: "Late Antique", color: "#7C3AED" }
    ],
    lsj: {
      definition: "dead body, corpse; living body, person; a body of men, troop; substance, matter",
      etymology: "origin obscure",
      cognates: []
    }
  }
};

const ERA_COLORS = {
  "Archaic": "#D97706",
  "Classical": "#F59E0B",
  "Hellenistic": "#3B82F6",
  "Imperial": "#DC2626",
  "Late Antique": "#7C3AED",
  "Byzantine": "#059669",
};

const TEXT_PRIMARY = "#F5F4F2";
const TEXT_SECONDARY = "#9CA3AF";
const TEXT_MUTED = "#6B7280";
const ACCENT_GOLD = "#C9A227";
const BACKGROUND_MAIN = "#0D0D0F";
const BACKGROUND_CARDS = "#1E1E24";
const BACKGROUND_DARKER = "#141419";

interface DotProps {
    x: number;
    y: number;
    color: string;
    era: string;
    index: number;
    total: number;
}

const Dot: React.FC<DotProps> = ({ x, y, color, era, index, total }) => {
    const angle = (index / total) * Math.PI * 2; // Distribute around a circle
    const radius = 30;
    const adjustedX = 50 + radius * Math.cos(angle); // Adjusted X to center
    const adjustedY = 50 + radius * Math.sin(angle); // Adjusted Y to center

    const [hovered, setHovered] = useState(false);

    return (
      <g transform={`translate(${x}, ${y})`}>
        <circle
            cx="0"
            cy="0"
            r={hovered ? 8 : 5}
            fill={color}
            style={{ transition: 'r 0.3s ease-in-out', cursor: 'pointer' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
        <title>{`${era}: X=${x}, Y=${y}`}</title>
        </circle>
        {hovered && (
          <text
            x={10}
            y={5}
            style={{
              fontSize: '0.7em',
              fill: TEXT_PRIMARY,
              pointerEvents: 'none',
            }}
          >
            {era}
          </text>
        )}
    </g>
    );
};



const WordDetails: React.FC<{ word: string }> = ({ word }) => {
  const data = WORDS[word];
  const [isInsightExpanded, setIsInsightExpanded] = useState(false);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (x - centerX) / 20;

    setRotationX(rotateX);
    setRotationY(rotateY);
  };

  const handleMouseLeave = () => {
    setRotationX(0);
    setRotationY(0);
  };

  if (!data) return <div style={{ color: TEXT_PRIMARY, padding: '20px' }}>Word not found.</div>;

  const toggleInsight = () => {
    setIsInsightExpanded(!isInsightExpanded);
  };


    const svgWidth = 200;
    const svgHeight = 150;
    const margin = 20;

    const maxX = Math.max(...data.embedding.map(point => point.x));
    const minX = Math.min(...data.embedding.map(point => point.x));
    const maxY = Math.max(...data.embedding.map(point => point.y));
    const minY = Math.min(...data.embedding.map(point => point.y));

    const xScale = (x: number) => margin + ((x - minX) / (maxX - minX)) * (svgWidth - 2 * margin);
    const yScale = (y: number) => svgHeight - margin - ((y - minY) / (maxY - minY)) * (svgHeight - 2 * margin);




  return (
    <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundColor: BACKGROUND_CARDS,
          color: TEXT_PRIMARY,
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'transform 0.3s ease-in-out',
          transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
          perspective: '1000px',
        }}
    >
      <h2 style={{ color: ACCENT_GOLD, marginBottom: '10px', fontSize: '1.5em' }}>
        {data.word} <span style={{ color: TEXT_SECONDARY, fontSize: '0.8em' }}>({data.translit})</span>
      </h2>
      <p style={{ color: TEXT_SECONDARY, marginBottom: '15px' }}>
        Traditional meaning: {data.traditional}
      </p>
      <p style={{ color: TEXT_MUTED, marginBottom: '10px' }}>
        Corpus evolution: {data.corpus}
      </p>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: ACCENT_GOLD, fontSize: '1.2em', marginBottom: '5px' }}>Semantic Drift</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {data.drift.map((d, index) => (
            <li key={index} style={{ marginBottom: '5px', color: TEXT_PRIMARY }}>
              <span style={{ fontWeight: 'bold', color: d.color }}>{d.era}:</span> {d.meaning} ({d.year})
            </li>
          ))}
        </ul>
      </div>

        <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: ACCENT_GOLD, fontSize: '1.2em', marginBottom: '5px' }}>Semantic Embedding</h3>
            <svg width={svgWidth} height={svgHeight}>
                {data.embedding.map((point, index) => (
                     <Dot
                         key={index}
                         x={xScale(point.x)}
                         y={yScale(point.y)}
                         color={point.color}
                         era={point.era}
                         index={index}
                         total={data.embedding.length}
                     />
                ))}
            </svg>
        </div>


      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: ACCENT_GOLD, fontSize: '1.2em', marginBottom: '5px' }}>Insight</h3>
        <p style={{ color: TEXT_PRIMARY, cursor: 'pointer' }} onClick={toggleInsight}>
          {isInsightExpanded ? data.insight : data.insight.substring(0, 100) + '... '}
          <span style={{ color: ACCENT_GOLD, fontWeight: 'bold' }}>
            {data.insight.length > 100 ? (isInsightExpanded ? 'Less' : 'More') : ''}
          </span>
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: ACCENT_GOLD, fontSize: '1.2em', marginBottom: '5px' }}>Paradigm</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: BACKGROUND_DARKER }}>
              <th style={{ padding: '8px', border: `1px solid ${TEXT_MUTED}`, color: TEXT_SECONDARY, textAlign: 'left' }}>Form</th>
              <th style={{ padding: '8px', border: `1px solid ${TEXT_MUTED}`, color: TEXT_SECONDARY, textAlign: 'left' }}>Greek</th>
              <th style={{ padding: '8px', border: `1px solid ${TEXT_MUTED}`, color: TEXT_SECONDARY, textAlign: 'left' }}>Function</th>
            </tr>
          </thead>
          <tbody>
            {data.paradigm.map((p, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? BACKGROUND_CARDS : BACKGROUND_MAIN }}>
                <td style={{ padding: '8px', border: `1px solid ${TEXT_MUTED}`, color: TEXT_PRIMARY }}>{p.form}</td>
                <td style={{ padding: '8px', border: `1px solid ${TEXT_MUTED}`, color: TEXT_PRIMARY }}>{p.greek} <span style={{ color: '#3B82F6' }}>Α</span></td>
                <td style={{ padding: '8px', border: `1px solid ${TEXT_MUTED}`, color: TEXT_PRIMARY }}>{p.function}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: ACCENT_GOLD, fontSize: '1.2em', marginBottom: '5px' }}>Manuscripts</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {data.manuscripts.map((m, index) => (
            <li key={index} style={{ marginBottom: '5px', color: TEXT_PRIMARY }}>
              <span style={{ fontWeight: 'bold', color: ACCENT_GOLD }}>{m.sigla}:</span> {m.reading} ({m.date}, Confidence: {m.confidence})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 style={{ color: ACCENT_GOLD, fontSize: '1.2em', marginBottom: '5px' }}>LSJ Definition</h3>
        <p style={{ color: TEXT_PRIMARY }}>{data.lsj.definition}</p>
        <p style={{ color: TEXT_MUTED }}>Etymology: {data.lsj.etymology}</p>
        {data.lsj.cognates.length > 0 && (
          <p style={{ color: TEXT_MUTED }}>
            Cognates: {data.lsj.cognates.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};



export default function Home() {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  return (
    <div style={{ backgroundColor: BACKGROUND_MAIN, minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: ACCENT_GOLD, fontSize: '2.5em', fontWeight: 'bold' }}>
          <span style={{ color: TEXT_PRIMARY }}>LOGOS</span> Professional Design System
        </h1>
        <p style={{ color: TEXT_SECONDARY }}>Ancient Greek Lexical Explorer</p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <aside style={{ width: '25%', backgroundColor: BACKGROUND_CARDS, padding: '15px', borderRadius: '8px' }}>
          <h2 style={{ color: ACCENT_GOLD, marginBottom: '15px', fontSize: '1.3em' }}>Words</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {Object.keys(WORDS).map(word => (
              <li key={word} style={{ marginBottom: '8px' }}>
                <button
                  onClick={() => setSelectedWord(word)}
                  style={{
                    backgroundColor: selectedWord === word ? ACCENT_GOLD : BACKGROUND_DARKER,
                    color: TEXT_PRIMARY,
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    transition: 'background-color 0.3s ease-in-out',
                  }}
                >
                  {word} <span style={{ color: '#3B82F6' }}>Α</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section style={{ width: '75%' }}>
          {selectedWord ? (
            <WordDetails word={selectedWord} />
          ) : (
            <div style={{ color: TEXT_PRIMARY, padding: '20px', backgroundColor: BACKGROUND_CARDS, borderRadius: '8px' }}>
              Select a word to see its details.
            </div>
          )}
        </section>
      </main>

      <footer style={{ marginTop: '30px', textAlign: 'center', color: TEXT_MUTED }}>
        <p>&copy; 2024 Logos Project. All rights reserved.</p>
      </footer>
    </div>
  );
}