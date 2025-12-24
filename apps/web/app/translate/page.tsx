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
  "arma": {
    type: "Second Declension (Neuter Plural)",
    forms: [
      { case: "Nominative", singular: "-", plural: "arma" },
      { case: "Genitive", singular: "-", plural: "armōrum" },
      { case: "Dative", singular: "-", plural: "armīs" },
      { case: "Accusative", singular: "-", plural: "arma" },
      { case: "Ablative", singular: "-", plural: "armīs" },
      { case: "Vocative", singular: "-", plural: "arma" }
    ]
  }
};

const ExampleComponent: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', fontFamily: 'sans-serif', minHeight: '100vh', padding: '20px', transition: 'background-color 0.3s ease' }}>
      <header style={{ marginBottom: '20px', borderBottom: '1px solid #1E1E24', paddingBottom: '10px' }}>
        <h1 style={{ color: '#C9A227', fontSize: '2em', fontWeight: 'bold', textAlign: 'center' }}>Logos Professional Design System</h1>
        <p style={{ color: '#9CA3AF', textAlign: 'center' }}>Ancient Language Lexicon</p>
      </header>

      <section style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: '#C9A227', marginBottom: '10px' }}>Word List</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {Object.keys(WORD_FORMS).map((word) => (
              <li key={word} style={{ marginBottom: '5px' }}>
                <button
                  onClick={() => handleWordClick(word)}
                  style={{
                    backgroundColor: '#1E1E24',
                    color: '#F5F4F2',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                    width: '100%',
                    textAlign: 'left',
                    ':hover': {
                      backgroundColor: '#334155',
                      color: '#F5F4F2',
                    },
                  }}
                >
                  {word}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 3, backgroundColor: '#1E1E24', padding: '20px', borderRadius: '10px', transition: 'background-color 0.3s ease' }}>
          {selectedWord ? (
            <>
              <h2 style={{ color: '#C9A227', marginBottom: '10px' }}>{selectedWord}</h2>
              <p style={{ color: '#F5F4F2' }}>
                <span style={{ fontWeight: 'bold' }}>Translation:</span> {WORD_FORMS[selectedWord].translation}
              </p>
              <p style={{ color: '#F5F4F2' }}>
                <span style={{ fontWeight: 'bold' }}>Type:</span> {WORD_FORMS[selectedWord].type}
              </p>
              <p style={{ color: '#F5F4F2' }}>
                <span style={{ fontWeight: 'bold' }}>Forms:</span> {WORD_FORMS[selectedWord].forms}
              </p>
              {WORD_FORMS[selectedWord].etymology && (
                <p style={{ color: '#F5F4F2' }}>
                  <span style={{ fontWeight: 'bold' }}>Etymology:</span> {WORD_FORMS[selectedWord].etymology}
                </p>
              )}
               {WORD_FORMS[selectedWord].lsj && (
                <p style={{ color: '#F5F4F2' }}>
                  <span style={{ fontWeight: 'bold' }}>LSJ:</span> {WORD_FORMS[selectedWord].lsj}
                </p>
              )}

              {WORD_FORMS[selectedWord].semanticHistory && (
                  <>
                    <h3 style={{ color: '#C9A227', marginTop: '15px' }}>Semantic History</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                      {WORD_FORMS[selectedWord].semanticHistory!.map((item, index) => (
                        <li key={index} style={{ marginBottom: '5px' }}>
                          <div style={{ padding: '10px', borderLeft: `5px solid ${item.color}`, backgroundColor: '#141419', borderRadius: '5px' }}>
                            <p style={{ color: '#F5F4F2', marginBottom: '5px' }}>
                              <span style={{ fontWeight: 'bold' }}>Period:</span> {item.period}
                            </p>
                            <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>
                              <span style={{ fontWeight: 'bold' }}>Meaning:</span> {item.meaning}
                            </p>
                            <p style={{ color: '#6B7280' }}>
                              <span style={{ fontWeight: 'bold' }}>Evidence:</span> {item.evidence}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

              {MANUSCRIPT_VARIANTS[selectedWord] && (
                  <>
                    <h3 style={{ color: '#C9A227', marginTop: '15px' }}>Manuscript Variants</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                      {MANUSCRIPT_VARIANTS[selectedWord].map((variant, index) => (
                        <li key={index} style={{ marginBottom: '5px' }}>
                          <div style={{ padding: '10px', backgroundColor: '#141419', borderRadius: '5px' }}>
                            <p style={{ color: '#F5F4F2', marginBottom: '5px' }}>
                              <span style={{ fontWeight: 'bold' }}>Manuscript:</span> {variant.ms}
                            </p>
                            <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>
                              <span style={{ fontWeight: 'bold' }}>Reading:</span> {variant.reading}
                            </p>
                            <p style={{ color: '#6B7280' }}>
                              <span style={{ fontWeight: 'bold' }}>Date:</span> {variant.date}, <span style={{ fontWeight: 'bold' }}>Location:</span> {variant.location}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                 {PARADIGM_TABLES[selectedWord] && (
                  <>
                    <h3 style={{ color: '#C9A227', marginTop: '15px' }}>Paradigm Table</h3>
                    <p style={{ color: '#F5F4F2' }}>
                      <span style={{ fontWeight: 'bold' }}>Type:</span> {PARADIGM_TABLES[selectedWord].type}
                    </p>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#141419', color: '#9CA3AF' }}>
                          <th style={{ padding: '8px', border: '1px solid #6B7280' }}>Case</th>
                          <th style={{ padding: '8px', border: '1px solid #6B7280' }}>Singular</th>
                          <th style={{ padding: '8px', border: '1px solid #6B7280' }}>Plural</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PARADIGM_TABLES[selectedWord].forms.map((form, index) => (
                          <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#1E1E24' : '#141419', color: '#F5F4F2' }}>
                            <td style={{ padding: '8px', border: '1px solid #6B7280' }}>{form.case}</td>
                            <td style={{ padding: '8px', border: '1px solid #6B7280' }}>{form.singular}</td>
                            <td style={{ padding: '8px', border: '1px solid #6B7280' }}>{form.plural}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
            </>
          ) : (
            <p style={{ color: '#9CA3AF' }}>Select a word to see details.</p>
          )}
        </div>
      </section>

      <section style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#C9A227', marginBottom: '10px' }}>Example Sentences</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {EXAMPLE_SENTENCES.map((sentence) => (
            <li key={sentence.id} style={{ marginBottom: '10px' }}>
              <div style={{ backgroundColor: '#1E1E24', padding: '15px', borderRadius: '10px', borderLeft: `5px solid ${sentence.color}` }}>
                <p style={{ color: '#F5F4F2', fontSize: '1.1em' }}>
                  <span style={{ fontWeight: 'bold', color: sentence.color }}>{sentence.indicator}:</span> {sentence.text}
                </p>
                <p style={{ color: '#9CA3AF' }}>
                  <span style={{ fontWeight: 'bold' }}>Translation:</span> {sentence.translation}
                </p>
                <p style={{ color: '#6B7280' }}>
                  <span style={{ fontWeight: 'bold' }}>Source:</span> {sentence.source}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer style={{ marginTop: '30px', textAlign: 'center', color: '#9CA3AF', borderTop: '1px solid #1E1E24', paddingTop: '10px' }}>
        <p>© 2024 Logos Professional Design System</p>
      </footer>
    </div>
  );
};

export default ExampleComponent;