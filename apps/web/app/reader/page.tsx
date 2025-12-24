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
  const chartRef = useRef(null);

  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 30;

    ctx.clearRect(0, 0, width, height);

    const eras = data.map(item => item.period);
    const values = data.map(item => item.frequency);
    const numEras = eras.length;

    // Find max frequency for scaling
    const maxFrequency = Math.max(...values);

    // Draw background grid
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 0.5;

    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (i / 5) * (height - 2 * padding);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      ctx.fillStyle = '#6B7280';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText((maxFrequency * (i / 5)).toFixed(1), padding - 5, y + 4); // Y-axis labels
    }


    // Draw the data points
    ctx.strokeStyle = '#C9A227'; // Brand Gold Color
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < numEras; i++) {
      const x = padding + (i / (numEras - 1)) * (width - 2 * padding);
      const y = height - padding - (values[i] / maxFrequency) * (height - 2 * padding);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();


    // Draw era labels on the x-axis
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i < numEras; i++) {
      const x = padding + (i / (numEras - 1)) * (width - 2 * padding);
      const y = height - 5; // Position label slightly above the bottom
      ctx.fillText(eras[i], x, y);
    }


    // Draw data point circles
    ctx.fillStyle = '#C9A227'; // Brand Gold Color
    for (let i = 0; i < numEras; i++) {
      const x = padding + (i / (numEras - 1)) * (width - 2 * padding);
      const y = height - padding - (values[i] / maxFrequency) * (height - 2 * padding);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }

  }, [data]);


  return (
    <canvas
      ref={chartRef}
      width={600}
      height={300}
      style={{
        width: '100%',
        maxWidth: '600px',
        height: 'auto',
        backgroundColor: '#1E1E24',
        borderRadius: '12px',
        marginTop: '16px',
        border: '1px solid rgba(201, 162, 39, 0.1)',
        boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.3)',
        transition: 'background-color 0.3s, border-color 0.3s, box-shadow 0.3s',
        display: 'block',
      }}
    />
  );
}


function WordDetails({ wordData }) {
  if (!wordData) {
    return (
      <div style={{
        backgroundColor: '#1E1E24',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '16px',
        border: '1px solid rgba(201, 162, 39, 0.1)',
        boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.3)',
        color: '#9CA3AF',
        transition: 'background-color 0.3s, border-color 0.3s, box-shadow 0.3s',
        textAlign: 'center'
      }}>
        Select a word to view details.
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#1E1E24',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '16px',
      border: '1px solid rgba(201, 162, 39, 0.1)',
      boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.3)',
      color: '#F5F4F2',
      transition: 'background-color 0.3s, border-color 0.3s, box-shadow 0.3s'
    }}>
      <h3 style={{ color: '#C9A227', marginBottom: '8px', fontWeight: 'bold' }}>{wordData.word}</h3>
      <p style={{ color: '#9CA3AF', marginBottom: '4px' }}>
        <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Lemma:</span> {wordData.lemma}
      </p>
      <p style={{ color: '#9CA3AF', marginBottom: '4px' }}>
        <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Part of Speech:</span> {wordData.partOfSpeech}
      </p>
      <p style={{ color: '#9CA3AF', marginBottom: '12px' }}>
        <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Definition:</span> {wordData.definition}
      </p>

      {wordData.etymology && (
        <div style={{ marginBottom: '12px' }}>
          <h4 style={{ color: '#C9A227', marginBottom: '4px' }}>Etymology</h4>
          <p style={{ color: '#9CA3AF' }}>{wordData.etymology}</p>
        </div>
      )}

      {wordData.paradigm && (
        <div style={{ marginBottom: '12px' }}>
          <h4 style={{ color: '#C9A227', marginBottom: '4px' }}>Paradigm</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {Object.entries(wordData.paradigm).map(([form, value]) => (
              <li key={form} style={{ color: '#9CA3AF' }}>
                <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>{form}:</span> {value}
              </li>
            ))}
          </ul>
        </div>
      )}

      {wordData.semanticDrift && (
        <div style={{ marginBottom: '12px' }}>
          <h4 style={{ color: '#C9A227', marginBottom: '8px' }}>Semantic Drift</h4>
          <SemanticDriftChart data={wordData.semanticDrift} />
        </div>
      )}
    </div>
  );
}

function TextDisplay({ text, onWordClick }) {
  const parts = text.split(/(\s+|[.,\/#!$%\^&\*;:{}=\-_`~()])/); // Split by spaces and punctuation
  return (
    <>
      {parts.map((part, index) => {
        if (wordData[part]) {
          const language = wordData[part].language;
          return (
            <button
              key={index}
              onClick={() => onWordClick(wordData[part])}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: (language === 'greek') ? '#3B82F6' : ((language === 'latin') ? '#DC2626' : '#F5F4F2'),
                cursor: 'pointer',
                fontFamily: (language === 'greek') ? 'Arial Unicode MS, sans-serif' : 'serif', //Ensure Greek chars render properly
                transition: 'color 0.2s',
                padding: 0,
                margin: 0,
                fontSize: 'inherit',
                lineHeight: 'inherit',
                textDecoration: 'underline dotted'
              }}
            >
              {part}
            </button>
          );
        } else {
          return <span key={index}>{part}</span>;
        }
      })}
    </>
  );
}


export default function Home() {
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedText, setSelectedText] = useState(sampleTexts[0]); // Default to the first text
  const searchParams = useSearchParams();
  const textId = searchParams.get('textId');

  useEffect(() => {
    if (textId) {
      const foundText = sampleTexts.find((text, index) => index.toString() === textId);
      if (foundText) {
        setSelectedText(foundText);
      }
    }
  }, [textId]);


  const handleWordClick = (word) => {
    setSelectedWord(word);
  };

  return (
    <div style={{
      backgroundColor: '#0D0D0F',
      minHeight: '100vh',
      padding: '20px',
      color: '#F5F4F2',
      fontFamily: 'sans-serif'
    }}>

      <header style={{
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '1px solid #1E1E24',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ color: '#C9A227', fontWeight: 'bold', fontSize: '2em' }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Logos Professional
          </Link>
        </h1>
        <nav>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', gap: '20px' }}>
            <li>
              <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#F5F4F2'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#F5F4F2'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#F5F4F2'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main style={{ display: 'flex', gap: '30px' }}>
        <section style={{ flex: '2', width: '70%' }}>
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(201, 162, 39, 0.1)',
            boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.3)',
            transition: 'background-color 0.3s, border-color 0.3s, box-shadow 0.3s',
          }}>
            <h2 style={{ color: '#C9A227', fontWeight: 'bold', marginBottom: '10px' }}>{selectedText.title}</h2>
            <h3 style={{ color: '#9CA3AF', marginBottom: '10px' }}>{selectedText.author} ({selectedText.era})</h3>
            <div style={{
              fontFamily: (selectedText.language === 'greek') ? 'Arial Unicode MS, sans-serif' : 'serif',
              fontSize: '1.2em',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              <TextDisplay text={selectedText.content} onWordClick={handleWordClick} />
            </div>
            <p style={{ color: '#9CA3AF', fontStyle: 'italic', marginBottom: '20px' }}>{selectedText.translation}</p>

            {selectedText.commentary && (
              <div>
                <h4 style={{ color: '#C9A227', marginBottom: '10px' }}>Commentary</h4>
                {selectedText.commentary.map((comment, index) => (
                  <div key={index} style={{ marginBottom: '15px' }}>
                    <h5 style={{ color: '#F5F4F2', fontWeight: 'bold' }}>{comment.section}</h5>
                    <p style={{ color: '#9CA3AF' }}>{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            {selectedText.apparatus && (
              <div>
                <h4 style={{ color: '#C9A227', marginBottom: '10px' }}>Apparatus Criticus</h4>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {selectedText.apparatus.map((entry, index) => (
                    <li key={index} style={{ color: '#9CA3AF', marginBottom: '5px' }}>
                      <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>{entry.lemma}:</span> {entry.note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <aside style={{ flex: '1', width: '30%' }}>
          <WordDetails wordData={selectedWord} />
        </aside>
      </main>


      <footer style={{
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid #1E1E24',
        textAlign: 'center',
        color: '#6B7280'
      }}>
        <p>&copy; 2024 Logos Professional. All rights reserved.</p>
      </footer>
    </div>
  );
}