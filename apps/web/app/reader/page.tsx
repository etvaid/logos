'use client'

import { useState, useEffect, Suspense } from 'react'
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

function WordInfo({ word, onClose }) {
  const data = wordData[word];

  if (!data) {
    return (
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        backgroundColor: '#1E1E24', color: '#F5F4F2', padding: '20px', borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', zIndex: 1000,
        transition: 'opacity 0.3s ease',
      }}>
        <p style={{ color: '#F5F4F2' }}>Word data not found.</p>
        <button
          onClick={onClose}
          style={{
            backgroundColor: '#C9A227', color: '#0D0D0F', padding: '8px 12px',
            border: 'none', borderRadius: '4px', cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            fontFamily: 'sans-serif',
            fontSize: '14px'
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#A6841A')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#C9A227')}
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      backgroundColor: '#1E1E24', color: '#F5F4F2', padding: '20px', borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', zIndex: 1000,
      transition: 'opacity 0.3s ease',
      width: '500px',
      maxWidth: '90%',
      fontFamily: 'sans-serif',
    }}>
      <h3 style={{ color: '#F5F4F2', fontFamily: 'serif', marginBottom: '10px', fontSize: '20px' }}>{data.word}</h3>
      <p style={{ color: '#9CA3AF', marginBottom: '5px', fontSize: '14px' }}><b>Lemma:</b> {data.lemma}</p>
      <p style={{ color: '#9CA3AF', marginBottom: '5px', fontSize: '14px' }}><b>Part of Speech:</b> {data.partOfSpeech}</p>
      <p style={{ color: '#F5F4F2', marginBottom: '10px', fontSize: '16px' }}><b>Definition:</b> {data.definition}</p>
      {data.etymology && <p style={{ color: '#9CA3AF', marginBottom: '10px', fontSize: '14px' }}><b>Etymology:</b> {data.etymology}</p>}

      {data.paradigm && (
        <div>
          <h4 style={{ color: '#F5F4F2', marginTop: '10px', marginBottom: '5px', fontSize: '16px' }}>Paradigm:</h4>
          <ul style={{ listStyle: 'none', padding: 0, color: '#9CA3AF', fontSize: '14px' }}>
            {Object.entries(data.paradigm).map(([key, value]) => (
              <li key={key} style={{ marginBottom: '3px' }}><b>{key}:</b> {value}</li>
            ))}
          </ul>
        </div>
      )}

      {data.manuscripts && (
        <div>
          <h4 style={{ color: '#F5F4F2', marginTop: '10px', marginBottom: '5px', fontSize: '16px' }}>Manuscript Readings:</h4>
          <ul style={{ listStyle: 'none', padding: 0, color: '#9CA3AF', fontSize: '14px' }}>
            {data.manuscripts.map((ms, index) => (
              <li key={index} style={{ marginBottom: '3px' }}><b>{ms.siglum}:</b> {ms.reading} ({ms.confidence})</li>
            ))}
          </ul>
        </div>
      )}

      {data.semanticDrift && (
        <div>
          <h4 style={{ color: '#F5F4F2', marginTop: '10px', marginBottom: '5px', fontSize: '16px' }}>Semantic Drift:</h4>
          <ul style={{ listStyle: 'none', padding: 0, color: '#9CA3AF', fontSize: '14px' }}>
            {data.semanticDrift.map((drift, index) => (
              <li key={index} style={{ marginBottom: '3px' }}><b>{drift.period}:</b> {drift.meaning} ({drift.frequency})</li>
            ))}
          </ul>
        </div>
      )}


      <button
        onClick={onClose}
        style={{
          backgroundColor: '#C9A227', color: '#0D0D0F', padding: '8px 12px',
          border: 'none', borderRadius: '4px', cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          fontFamily: 'sans-serif',
          fontSize: '14px',
          marginTop: '20px'
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#A6841A')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#C9A227')}
      >
        Close
      </button>
    </div>
  );
}


function TextDisplay({ text }) {
  const [selectedWord, setSelectedWord] = useState(null);

  const handleWordClick = (word) => {
    setSelectedWord(word);
  };

  const handleCloseWordInfo = () => {
    setSelectedWord(null);
  };

  const getLanguageIndicator = (language) => {
    if (language === 'greek') return 'Α';
    if (language === 'latin') return 'L';
    return '';
  };

  const getLanguageColor = (language) => {
    if (language === 'greek') return '#3B82F6';
    if (language === 'latin') return '#DC2626';
    return '#F5F4F2';
  };

  const eraColor = eraColors[text.era] || '#F5F4F2'; // Default color if era not found

  const words = text.content.split(/(\s+)/).filter(Boolean);

  return (
    <div style={{
      backgroundColor: '#1E1E24', padding: '20px', borderRadius: '8px',
      marginBottom: '20px', transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      fontFamily: 'serif',
      color: '#F5F4F2'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{
          color: '#F5F4F2', fontFamily: 'serif', fontSize: '22px',
          borderBottom: `2px solid ${eraColor}`, paddingBottom: '5px'
        }}>
          {text.title}
        </h3>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          backgroundColor: eraColor, color: '#0D0D0F', padding: '5px 10px',
          borderRadius: '5px', fontSize: '14px', fontWeight: 'bold',
          transition: 'background-color 0.3s ease'
        }}>
          {text.era}
        </div>
      </div>

      <p style={{ color: '#9CA3AF', marginBottom: '10px', fontSize: '14px' }}>
        <b>Author:</b> {text.author}
      </p>
      <div style={{
        display: 'flex', alignItems: 'center', marginBottom: '10px',
        color: getLanguageColor(text.language)
      }}>
        <b>Language:</b> {text.language} ({getLanguageIndicator(text.language)})
      </div>


      <div style={{
        marginBottom: '15px', fontFamily: 'Georgia, serif', fontSize: '18px',
        lineHeight: '1.6', wordWrap: 'break-word'
      }}>
        {words.map((word, index) => {
          const isWordInDictionary = wordData.hasOwnProperty(word);
          return (
            <span key={index}>
              {isWordInDictionary ? (
                <span
                  style={{
                    cursor: 'pointer',
                    color: '#C9A227',
                    transition: 'color 0.2s ease',
                    fontWeight: 'bold',
                    textShadow: '0.5px 0.5px 1px rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      color: '#F5F4F2',
                    },
                  }}
                  onClick={() => handleWordClick(word)}
                >
                  {word}
                </span>
              ) : (
                word
              )}
              {index < words.length - 1 && <span> </span>}
            </span>
          );
        })}
      </div>

      <p style={{ color: '#6B7280', fontStyle: 'italic', marginBottom: '15px', fontSize: '14px' }}>
        <i>Translation:</i> {text.translation}
      </p>


      {text.commentary && text.commentary.length > 0 && (
        <div>
          <h4 style={{ color: '#F5F4F2', fontFamily: 'serif', fontSize: '18px', marginBottom: '10px' }}>Commentary:</h4>
          {text.commentary.map((comment, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <h5 style={{ color: '#C9A227', fontFamily: 'serif', fontSize: '16px', marginBottom: '5px' }}>{comment.section}</h5>
              <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.5' }}>{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      {text.apparatus && text.apparatus.length > 0 && (
        <div>
          <h4 style={{ color: '#F5F4F2', fontFamily: 'serif', fontSize: '18px', marginBottom: '10px' }}>Apparatus Criticus:</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {text.apparatus.map((apparatusItem, index) => (
              <li key={index} style={{ color: '#6B7280', fontSize: '14px', marginBottom: '5px' }}>
                <b>{apparatusItem.lemma}:</b> {apparatusItem.note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedWord && <WordInfo word={selectedWord} onClose={handleCloseWordInfo} />}
    </div>
  );
}


export default function Home() {
  return (
    <div style={{
      backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh',
      padding: '20px', fontFamily: 'Arial, sans-serif',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      <header style={{
        marginBottom: '30px', textAlign: 'center',
        borderBottom: '2px solid #C9A227', paddingBottom: '20px'
      }}>
        <h1 style={{
          fontSize: '3em', fontWeight: 'bold', color: '#F5F4F2',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', fontFamily: 'serif'
        }}>
          Logos Professional Design System
        </h1>
        <p style={{
          fontSize: '1.2em', color: '#9CA3AF',
          fontStyle: 'italic'
        }}>
          Ancient Texts, Modern Display
        </p>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto' }}>
        {sampleTexts.map((text) => (
          <TextDisplay key={text.urn} text={text} />
        ))}
      </main>

      <footer style={{
        marginTop: '50px', textAlign: 'center',
        color: '#6B7280', fontSize: '0.9em',
        paddingTop: '20px', borderTop: '1px solid #1E1E24'
      }}>
        © 2024 Logos Professional Design System
      </footer>
    </div>
  )
}