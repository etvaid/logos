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
  },
    "virtus": {
    type: "Third Declension (Feminine)",
    forms: [
      { case: "Nominative", singular: "virtūs", plural: "virtūtēs" },
      { case: "Genitive", singular: "virtūtis", plural: "virtūtum" },
      { case: "Dative", singular: "virtūtī", plural: "virtūtibus" },
      { case: "Accusative", singular: "virtūtem", plural: "virtūtēs" },
      { case: "Ablative", singular: "virtūte", plural: "virtūtibus" },
      { case: "Vocative", singular: "virtūs", plural: "virtūtēs" }
    ]
  }
};

const WordDetail = ({ word }: { word: string }) => {
  const wordData = WORD_FORMS[word];
  const variants = MANUSCRIPT_VARIANTS[word] || [];

  if (!wordData) {
    return <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', padding: '20px', transition: 'background-color 0.3s' }}>Word not found.</div>;
  }

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', padding: '20px', fontFamily: 'sans-serif', transition: 'background-color 0.3s' }}>
      <h2 style={{ color: '#C9A227', marginBottom: '10px', borderBottom: '1px solid #1E1E24', paddingBottom: '5px' }}>
        {word}
      </h2>

      <div style={{ backgroundColor: '#1E1E24', padding: '15px', marginBottom: '15px', borderRadius: '5px', transition: 'background-color 0.3s' }}>
        <h3 style={{ color: '#F5F4F2', marginBottom: '5px' }}>Translation:</h3>
        <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>{wordData.translation}</p>
        <h3 style={{ color: '#F5F4F2', marginBottom: '5px' }}>Type:</h3>
        <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>{wordData.type}</p>
        <h3 style={{ color: '#F5F4F2', marginBottom: '5px' }}>Forms:</h3>
        <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>{wordData.forms}</p>
        {wordData.etymology && (
          <>
            <h3 style={{ color: '#F5F4F2', marginBottom: '5px' }}>Etymology:</h3>
            <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>{wordData.etymology}</p>
          </>
        )}
        {wordData.lsj && (
          <>
            <h3 style={{ color: '#F5F4F2', marginBottom: '5px' }}>LSJ Definition:</h3>
            <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>{wordData.lsj}</p>
          </>
        )}
      </div>

        {wordData.semanticHistory && wordData.semanticHistory.length > 0 && (
          <div style={{ backgroundColor: '#1E1E24', padding: '15px', marginBottom: '15px', borderRadius: '5px', transition: 'background-color 0.3s' }}>
            <h3 style={{ color: '#F5F4F2', marginBottom: '10px' }}>Semantic History:</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {wordData.semanticHistory.map((entry, index) => (
                <li key={index} style={{ marginBottom: '10px', padding: '10px', borderLeft: `5px solid ${entry.color}`, backgroundColor: '#141419', borderRadius: '5px', transition: 'background-color 0.3s' }}>
                  <strong style={{ color: entry.color }}>{entry.period}:</strong> {entry.meaning}
                  <p style={{ color: '#9CA3AF', fontSize: '0.9em' }}>Evidence: {entry.evidence}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

      {variants.length > 0 && (
        <div style={{ backgroundColor: '#1E1E24', padding: '15px', marginBottom: '15px', borderRadius: '5px', transition: 'background-color 0.3s' }}>
          <h3 style={{ color: '#F5F4F2', marginBottom: '10px' }}>Manuscript Variants:</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: '#9CA3AF' }}>
                <th style={{ padding: '8px', borderBottom: '1px solid #6B7280', textAlign: 'left' }}>Manuscript</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #6B7280', textAlign: 'left' }}>Reading</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #6B7280', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #6B7280', textAlign: 'left' }}>Location</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant, index) => (
                <tr key={index} style={{ color: '#F5F4F2' }}>
                  <td style={{ padding: '8px' }}>{variant.ms}</td>
                  <td style={{ padding: '8px' }}>{variant.reading}</td>
                  <td style={{ padding: '8px' }}>{variant.date}</td>
                  <td style={{ padding: '8px' }}>{variant.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        {PARADIGM_TABLES[word] && (
            <div style={{ backgroundColor: '#1E1E24', padding: '15px', marginBottom: '15px', borderRadius: '5px', transition: 'background-color 0.3s' }}>
                <h3 style={{ color: '#F5F4F2', marginBottom: '10px' }}>Declension Table:</h3>
                <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>Type: {PARADIGM_TABLES[word].type}</p>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ color: '#9CA3AF' }}>
                        <th style={{ padding: '8px', borderBottom: '1px solid #6B7280', textAlign: 'left' }}>Case</th>
                        <th style={{ padding: '8px', borderBottom: '1px solid #6B7280', textAlign: 'left' }}>Singular</th>
                        <th style={{ padding: '8px', borderBottom: '1px solid #6B7280', textAlign: 'left' }}>Plural</th>
                    </tr>
                    </thead>
                    <tbody>
                    {PARADIGM_TABLES[word].forms.map((form, index) => (
                        <tr key={index} style={{ color: '#F5F4F2' }}>
                            <td style={{ padding: '8px' }}>{form.case}</td>
                            <td style={{ padding: '8px' }}>{form.singular}</td>
                            <td style={{ padding: '8px' }}>{form.plural}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  );
};


export default function Home() {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
  };

  const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', transition: 'background-color 0.3s' }}>

      {/* Header */}
      <header style={{ backgroundColor: '#1E1E24', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background-color 0.3s' }}>
        <h1 style={{ color: '#C9A227', margin: 0, fontSize: '24px' }}>Logos Professional</h1>
          <button
              onClick={toggleMenu}
              style={{
                  background: 'none',
                  border: 'none',
                  color: '#F5F4F2',
                  fontSize: '24px',
                  cursor: 'pointer',
                  transition: 'color 0.3s'
              }}
          >
              ☰
          </button>
      </header>

      {/* Navigation Menu */}
      <nav style={{ backgroundColor: '#141419', padding: '10px', display: isMenuOpen ? 'block' : 'none', transition: 'display 0.3s, background-color 0.3s' }}>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              <li><Link href="/" style={{ display: 'block', color: '#9CA3AF', padding: '10px', textDecoration: 'none', transition: 'color 0.3s', '&:hover': { color: '#F5F4F2' } }}>Home</Link></li>
              <li><Link href="/about" style={{ display: 'block', color: '#9CA3AF', padding: '10px', textDecoration: 'none', transition: 'color 0.3s', '&:hover': { color: '#F5F4F2' } }}>About</Link></li>
              <li><Link href="/contact" style={{ display: 'block', color: '#9CA3AF', padding: '10px', textDecoration: 'none', transition: 'color 0.3s', '&:hover': { color: '#F5F4F2' } }}>Contact</Link></li>
          </ul>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '20px', display: 'flex', transition: 'padding 0.3s' }}>
        {/* Word List */}
        <div style={{ width: '250px', marginRight: '20px', backgroundColor: '#1E1E24', padding: '15px', borderRadius: '5px', transition: 'background-color 0.3s' }}>
          <h2 style={{ color: '#C9A227', marginBottom: '15px', borderBottom: '1px solid #141419', paddingBottom: '5px' }}>Words</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {Object.keys(WORD_FORMS).sort().map(word => (
              <li key={word}
                  style={{
                    padding: '10px',
                    marginBottom: '5px',
                    backgroundColor: hoveredWord === word ? '#141419' : 'transparent',
                    color: '#F5F4F2',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s, color 0.3s',
                    borderRadius: '5px',
                  }}
                  onClick={() => handleWordClick(word)}
                  onMouseEnter={() => setHoveredWord(word)}
                  onMouseLeave={() => setHoveredWord(null)}
              >
                {word}
                {word.charCodeAt(0) >= 913 && word.charCodeAt(0) <= 937 ? <span style={{color: '#3B82F6', marginLeft: '5px'}}>Α</span> : null}
                {word.charCodeAt(0) >= 65 && word.charCodeAt(0) <= 90 ? <span style={{color: '#DC2626', marginLeft: '5px'}}>L</span> : null}
              </li>
            ))}
          </ul>
        </div>

        {/* Word Detail */}
        <div style={{ flex: 1, transition: 'flex 0.3s' }}>
          {selectedWord && <WordDetail word={selectedWord} />}
          {!selectedWord && (
            <div style={{ backgroundColor: '#1E1E24', color: '#9CA3AF', padding: '20px', borderRadius: '5px', textAlign: 'center', transition: 'background-color 0.3s' }}>
              Select a word to view details.
            </div>
          )}
        </div>
      </main>

      {/* Example Sentences */}
      <div style={{ backgroundColor: '#141419', padding: '20px', borderTop: '1px solid #1E1E24', transition: 'background-color 0.3s' }}>
        <h2 style={{ color: '#C9A227', marginBottom: '15px' }}>Example Sentences</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {EXAMPLE_SENTENCES.map(sentence => (
            <li key={sentence.id} style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#1E1E24', borderRadius: '5px', transition: 'background-color 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ color: sentence.color, fontWeight: 'bold', marginRight: '5px' }}>{sentence.indicator}</span>
                <span style={{ color: '#F5F4F2' }}>{sentence.language}</span>
              </div>
              <p style={{ color: '#F5F4F2', marginBottom: '5px' }}>{sentence.text}</p>
              <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>{sentence.translation}</p>
              <p style={{ color: '#6B7280', fontSize: '0.8em' }}>Source: {sentence.source} ({sentence.period})</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1E1E24', color: '#9CA3AF', textAlign: 'center', padding: '10px', fontSize: '0.8em', transition: 'background-color 0.3s' }}>
        &copy; 2024 Logos Professional. All rights reserved.
      </footer>
    </div>
  );
}