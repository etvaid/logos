'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Word forms dictionary
const WORD_FORMS: Record<string, { translation: string; type: string; forms: string; etymology?: string; lsj?: string; embedding?: number[]; semanticHistory?: Array<{period: string; meaning: string; evidence: string; color: string}> }> = {
  // Greek words
  "μῆνιν": {
    translation: "wrath, rage",
    type: "noun (accusative)",
    forms: "μῆνις, μῆνιδος (f.)",
    etymology: "From Proto-Indo-European *mēnis-",
    lsj: "μῆνις, ιδος, ἡ, wrath, anger, esp. of the gods",
    embedding: [0.2, 0.8, 0.1, 0.9, 0.3],
    semanticHistory: [
      { period: "Archaic", meaning: "divine wrath", evidence: "Homer Il. 1.1", color: "#D97706" },
      { period: "Classical", meaning: "human anger", evidence: "Aeschylus Ag. 155", color: "#F59E0B" },
      { period: "Hellenistic", meaning: "resentment", evidence: "Polybius 1.35.6", color: "#3B82F6" }
    ]
  },
  "ἄειδε": {
    translation: "sing!",
    type: "verb (imperative 2sg)",
    forms: "ἀείδω, ἀείσω, ἤεισα",
    etymology: "From *aweyd- 'to sing'",
    lsj: "ἀείδω, sing, chant, esp. epic poetry",
    embedding: [0.7, 0.3, 0.8, 0.2, 0.6]
  },
  "θεὰ": {
    translation: "goddess",
    type: "noun (vocative)",
    forms: "θεός, θεοῦ (m./f.)",
    etymology: "From *dheh₁s- 'divine'",
    lsj: "θεός, οῦ, ὁ, ἡ, god, goddess, divine being",
    embedding: [0.9, 0.1, 0.7, 0.8, 0.4]
  },
  "λόγος": {
    translation: "word, reason",
    type: "noun (nominative)",
    forms: "λόγος, λόγου (m.)",
    etymology: "From *leg- 'to gather, speak'",
    lsj: "λόγος, ου, ὁ, word, speech, reason, account",
    embedding: [0.5, 0.9, 0.3, 0.7, 0.8],
    semanticHistory: [
      { period: "Archaic", meaning: "speech, tale", evidence: "Homer Od. 1.56", color: "#D97706" },
      { period: "Classical", meaning: "reason, argument", evidence: "Heraclitus DK 22 B1", color: "#F59E0B" },
      { period: "Hellenistic", meaning: "divine principle", evidence: "Stoic sources", color: "#3B82F6" },
      { period: "Imperial", meaning: "Christian Logos", evidence: "John 1:1", color: "#DC2626" }
    ]
  },
  // Latin words
  "arma": {
    translation: "arms, weapons",
    type: "noun (accusative pl.)",
    forms: "arma, armōrum (n.)",
    etymology: "From *h₂er- 'to fit together'",
    embedding: [0.8, 0.2, 0.9, 0.1, 0.5]
  },
  "virumque": {
    translation: "and the man",
    type: "noun (acc.) + enclitic",
    forms: "vir, virī (m.) + -que",
    etymology: "From *wiHrós 'man'",
    embedding: [0.6, 0.4, 0.7, 0.3, 0.8]
  },
  "virtus": {
    translation: "virtue, courage",
    type: "noun (nominative)",
    forms: "virtūs, virtūtis (f.)",
    etymology: "From vir 'man' + -tūs",
    embedding: [0.4, 0.8, 0.2, 0.9, 0.6],
    semanticHistory: [
      { period: "Archaic", meaning: "manliness, physical strength", evidence: "Ennius Ann. 363", color: "#D97706" },
      { period: "Classical", meaning: "moral excellence", evidence: "Cicero Rep. 1.2", color: "#F59E0B" },
      { period: "Imperial", meaning: "Christian virtue", evidence: "Augustine Conf. 8.1", color: "#DC2626" },
      { period: "Late Antique", meaning: "ascetic virtue", evidence: "Jerome Ep. 22.7", color: "#7C3AED" }
    ]
  }
};

// Manuscript variants
const MANUSCRIPT_VARIANTS: Record<string, Array<{ms: string; reading: string; date: string; location: string}>> = {
  "μῆνιν": [
    { ms: "A (Venetus A)", reading: "μῆνιν", date: "10th c.", location: "Venice" },
    { ms: "B (Venetus B)", reading: "μῆνιν", date: "11th c.", location: "Venice" },
    { ms: "T (Townleyanus)", reading: "μῆνιν", date: "11th c.", location: "London" }
  ],
  "ἄειδε": [
    { ms: "A", reading: "ἄειδε", date: "10th c.", location: "Venice" },
    { ms: "B", reading: "ἄειδε", date: "11th c.", location: "Venice" },
    { ms: "Π¹", reading: "εἰδε", date: "12th c.", location: "Paris" }
  ],
  "arma": [
    { ms: "M (Mediceus)", reading: "arma", date: "5th c.", location: "Florence" },
    { ms: "P (Palatinus)", reading: "arma", date: "4th-5th c.", location: "Vatican" },
    { ms: "R (Romanus)", reading: "arma", date: "5th c.", location: "Vatican" }
  ],
  "λόγος": [
    { ms: "P.Oxy. 2069", reading: "λόγος", date: "3rd c. CE", location: "Oxyrhynchus" },
    { ms: "Laurentianus", reading: "λόγος", date: "9th c.", location: "Florence" }
  ]
};

// Example sentences
const EXAMPLE_SENTENCES = [
  {
    id: 1,
    language: "Greek",
    indicator: "Α",
    color: "#3B82F6",
    text: "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος",
    translation: "Sing, goddess, of the wrath of Achilles, son of Peleus",
    source: "Homer, Iliad 1.1",
    period: "Archaic"
  },
  {
    id: 2,
    language: "Greek",
    indicator: "Α",
    color: "#3B82F6",
    text: "ἐν ἀρχῇ ἦν ὁ λόγος",
    translation: "In the beginning was the Word",
    source: "John 1:1",
    period: "Imperial"
  },
  {
    id: 3,
    language: "Latin",
    indicator: "L",
    color: "#DC2626",
    text: "Arma virumque cano, Troiae qui primus ab oris",
    translation: "I sing of arms and the man, who first from the shores of Troy",
    source: "Virgil, Aeneid 1.1",
    period: "Imperial"
  }
];

// Declension tables
const PARADIGM_TABLES: Record<string, {type: string; forms: Array<{case: string; singular: string; plural: string}>}> = {
  "μῆνις": {
    type: "Third Declension (Feminine)",
    forms: [
      { case: "Nominative", singular: "μῆνις", plural: "μήνιδες" },
      { case: "Genitive", singular: "μήνιδος", plural: "μηνίδων" },
      { case: "Dative", singular: "μήνιδι", plural: "μήνισι(ν)" },
      { case: "Accusative", singular: "μῆνιν", plural: "μήνιδας" },
      { case: "Vocative", singular: "μῆνι", plural: "μήνιδες" }
    ]
  },
  "λόγος": {
    type: "Second Declension (Masculine)",
    forms: [
      { case: "Nominative", singular: "λόγος", plural: "λόγοι" },
      { case: "Genitive", singular: "λόγου", plural: "λόγων" },
      { case: "Dative", singular: "λόγῳ", plural: "λόγοις" },
      { case: "Accusative", singular: "λόγον", plural: "λόγους" },
      { case: "Vocative", singular: "λόγε", plural: "λόγοι" }
    ]
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

function generate3DShadow(x: number, y: number, blur: number, color: string) {
  return `${x}px ${y}px ${blur}px ${color}`;
}

const Home = () => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out';
    }
  }, []);


  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <h1 style={{ color: '#C9A227', fontSize: '2.5em', marginBottom: '20px', textShadow: '2px 2px 4px #000000' }}>Logos Professional Design System</h1>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.keys(WORD_FORMS).map((word) => (
          <div
            key={word}
            style={{
              backgroundColor: '#1E1E24',
              color: '#F5F4F2',
              padding: '20px',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              boxShadow: isHovered ? generate3DShadow(3, 3, 6, 'rgba(0, 0, 0, 0.5)') : '2px 2px 4px rgba(0, 0, 0, 0.3)',
              transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
              width: '200px',
              textAlign: 'center',
            }}
            onClick={() => handleWordClick(word)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={cardRef}
          >
            <strong style={{ color: '#C9A227', fontSize: '1.2em' }}>{word}</strong>
          </div>
        ))}
      </div>

      {selectedWord && (
        <div style={{
          backgroundColor: '#141419',
          color: '#F5F4F2',
          marginTop: '30px',
          padding: '30px',
          borderRadius: '15px',
          maxWidth: '800px',
          width: '100%',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)',
          transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
          opacity: 1,
          transform: 'translateY(0)',
        }}>
          <h2 style={{ color: '#C9A227', fontSize: '1.8em', marginBottom: '15px', borderBottom: '1px solid #6B7280', paddingBottom: '10px' }}>
            {selectedWord}
          </h2>

          <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>
            <strong>Translation:</strong> {WORD_FORMS[selectedWord].translation}
          </p>
          <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>
            <strong>Type:</strong> {WORD_FORMS[selectedWord].type}
          </p>
          <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>
            <strong>Forms:</strong> {WORD_FORMS[selectedWord].forms}
          </p>
          {WORD_FORMS[selectedWord].etymology && (
            <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>
              <strong>Etymology:</strong> {WORD_FORMS[selectedWord].etymology}
            </p>
          )}
          {WORD_FORMS[selectedWord].lsj && (
            <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>
              <strong>LSJ Definition:</strong> {WORD_FORMS[selectedWord].lsj}
            </p>
          )}

          {WORD_FORMS[selectedWord].semanticHistory && (
            <>
              <h3 style={{ color: '#C9A227', fontSize: '1.4em', marginTop: '20px', marginBottom: '10px' }}>Semantic History</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #6B7280' }}>
                  <thead>
                    <tr>
                      <th style={{ backgroundColor: '#1E1E24', color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280', textAlign: 'left' }}>Period</th>
                      <th style={{ backgroundColor: '#1E1E24', color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280', textAlign: 'left' }}>Meaning</th>
                      <th style={{ backgroundColor: '#1E1E24', color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280', textAlign: 'left' }}>Evidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WORD_FORMS[selectedWord].semanticHistory!.map((item, index) => (
                      <tr key={index} style={{ backgroundColor: '#141419' }}>
                        <td style={{ color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280' }}><span style={{ color: item.color }}>{item.period}</span></td>
                        <td style={{ color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280' }}>{item.meaning}</td>
                        <td style={{ color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280' }}>{item.evidence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {MANUSCRIPT_VARIANTS[selectedWord] && (
            <>
              <h3 style={{ color: '#C9A227', fontSize: '1.4em', marginTop: '20px', marginBottom: '10px' }}>Manuscript Variants</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #6B7280' }}>
                  <thead>
                    <tr>
                      <th style={{ backgroundColor: '#1E1E24', color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280', textAlign: 'left' }}>Manuscript</th>
                      <th style={{ backgroundColor: '#1E1E24', color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280', textAlign: 'left' }}>Reading</th>
                      <th style={{ backgroundColor: '#1E1E24', color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280', textAlign: 'left' }}>Date</th>
                      <th style={{ backgroundColor: '#1E1E24', color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280', textAlign: 'left' }}>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MANUSCRIPT_VARIANTS[selectedWord]!.map((variant, index) => (
                      <tr key={index} style={{ backgroundColor: '#141419' }}>
                        <td style={{ color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280' }}>{variant.ms}</td>
                        <td style={{ color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280' }}>{variant.reading}</td>
                        <td style={{ color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280' }}>{variant.date}</td>
                        <td style={{ color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280' }}>{variant.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {PARADIGM_TABLES[selectedWord] && (
            <>
              <h3 style={{ color: '#C9A227', fontSize: '1.4em', marginTop: '20px', marginBottom: '10px' }}>Declension Table</h3>
              <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>
                <strong>Type:</strong> {PARADIGM_TABLES[selectedWord].type}
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #6B7280' }}>
                  <thead>
                    <tr>
                      <th style={{ backgroundColor: '#1E1E24', color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280', textAlign: 'left' }}>Case</th>
                      <th style={{ backgroundColor: '#1E1E24', color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280', textAlign: 'left' }}>Singular</th>
                      <th style={{ backgroundColor: '#1E1E24', color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280', textAlign: 'left' }}>Plural</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PARADIGM_TABLES[selectedWord].forms.map((form, index) => (
                      <tr key={index} style={{ backgroundColor: '#141419' }}>
                        <td style={{ color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280' }}>{form.case}</td>
                        <td style={{ color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280' }}>{form.singular}</td>
                        <td style={{ color: '#F5F4F2', padding: '8px', border: '1px solid #6B7280' }}>{form.plural}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      <footer style={{ marginTop: '40px', color: '#9CA3AF', textAlign: 'center' }}>
        <p>&copy; 2024 Logos Professional Design System</p>
      </footer>
    </div>
  );
};

export default Home;