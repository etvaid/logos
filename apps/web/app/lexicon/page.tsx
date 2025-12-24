'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';

export default function Lexicon() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);
  const [showEtymology, setShowEtymology] = useState(true);
  const [showParadigm, setShowParadigm] = useState(false);
  const [activeTab, setActiveTab] = useState('definition');
  const [showSemanticDrift, setShowSemanticDrift] = useState(false);

  const lexiconEntries = [
    {
      id: 1,
      headword: 'λόγος',
      polytonic: 'λόγος',
      pronunciation: 'LOG-os',
      pos: 'noun, masculine',
      lsj: '1056',
      definitions: [
        { sense: 'I', definition: 'that which is said or spoken, word, saying', citations: ['Hom. Il. 1.73', 'Hdt. 1.8'] },
        { sense: 'II', definition: 'account, explanation, reason', citations: ['Pl. Ap. 20c', 'Arist. Metaph. 981a'] },
        { sense: 'III', definition: 'ratio, proportion', citations: ['Eucl. Elem. 6.1'] },
        { sense: 'IV', definition: 'the Word, divine reason (in philosophy)', citations: ['Heraclit. fr. 1', 'Jo. 1.1'] }
      ],
      etymology: {
        root: '√leg-',
        cognates: ['Latin: legere', 'English: logic, -logy', 'Gothic: lisan'],
        development: 'PIE *leǵ- "to collect, gather" → Greek λέγω "to speak" → λόγος "word, reason"',
        semanticShift: 'concrete speech → abstract reason → divine principle'
      },
      paradigm: [
        { case: 'Nom.', singular: 'λόγος', plural: 'λόγοι' },
        { case: 'Gen.', singular: 'λόγου', plural: 'λόγων' },
        { case: 'Dat.', singular: 'λόγῳ', plural: 'λόγοις' },
        { case: 'Acc.', singular: 'λόγον', plural: 'λόγους' },
        { case: 'Voc.', singular: 'λόγε', plural: 'λόγοι' }
      ],
      manuscripts: [
        { ms: 'P.Oxy. 1', variant: 'λογος', note: 'without accent', date: '3rd c. CE' },
        { ms: 'Cod. Vat.', variant: 'λόγος', note: 'standard form', date: '4th c. CE' },
        { ms: 'P.Berol.', variant: 'λωγος', note: 'iotacism', date: '5th c. CE' }
      ],
      frequency: 0.89,
      era: 'Classical',
      semanticDrift: [
        { period: 'Archaic', meaning: 'speech, utterance', strength: 0.9 },
        { period: 'Classical', meaning: 'reason, argument', strength: 0.8 },
        { period: 'Hellenistic', meaning: 'divine principle', strength: 0.7 },
        { period: 'Imperial', meaning: 'Christian Word', strength: 0.6 }
      ],
      wordEmbeddings: [
        { word: 'ῥῆμα', similarity: 0.85, meaning: 'utterance' },
        { word: 'νοῦς', similarity: 0.78, meaning: 'mind' },
        { word: 'σοφία', similarity: 0.72, meaning: 'wisdom' },
        { word: 'ἐπιστήμη', similarity: 0.69, meaning: 'knowledge' }
      ]
    },
    {
      id: 2,
      headword: 'σοφία',
      polytonic: 'σοφία',
      pronunciation: 'so-PHI-a',
      pos: 'noun, feminine',
      lsj: '1621',
      definitions: [
        { sense: 'I', definition: 'skill, cleverness in handicraft', citations: ['Hom. Il. 15.412', 'Hes. Op. 430'] },
        { sense: 'II', definition: 'wisdom, learning', citations: ['Sol. fr. 13', 'Hdt. 1.30'] },
        { sense: 'III', definition: 'philosophy, theoretical wisdom', citations: ['Pl. Ap. 20d', 'Arist. EN 1141a'] }
      ],
      etymology: {
        root: '√soph-',
        cognates: ['σοφός (wise)', 'σοφιστής (sophist)', 'φιλοσοφία (philosophy)'],
        development: 'From σοφός "skilled, wise" + abstract suffix -ία',
        semanticShift: 'technical skill → intellectual wisdom → philosophical knowledge'
      },
      paradigm: [
        { case: 'Nom.', singular: 'σοφία', plural: 'σοφίαι' },
        { case: 'Gen.', singular: 'σοφίας', plural: 'σοφιῶν' },
        { case: 'Dat.', singular: 'σοφίᾳ', plural: 'σοφίαις' },
        { case: 'Acc.', singular: 'σοφίαν', plural: 'σοφίας' },
        { case: 'Voc.', singular: 'σοφία', plural: 'σοφίαι' }
      ],
      manuscripts: [
        { ms: 'P.Berol.', variant: 'σοφια', note: 'iotacism', date: '3rd c. CE' },
        { ms: 'Cod. Alex.', variant: 'σοφία', note: 'standard', date: '5th c. CE' }
      ],
      frequency: 0.65,
      era: 'Classical',
      semanticDrift: [
        { period: 'Archaic', meaning: 'technical skill', strength: 0.9 },
        { period: 'Classical', meaning: 'wisdom', strength: 0.85 },
        { period: 'Hellenistic', meaning: 'philosophy', strength: 0.75 }
      ],
      wordEmbeddings: [
        { word: 'φρόνησις', similarity: 0.82, meaning: 'practical wisdom' },
        { word: 'ἐπιστήμη', similarity: 0.79, meaning: 'knowledge' },
        { word: 'τέχνη', similarity: 0.71, meaning: 'skill' }
      ]
    },
    {
      id: 3,
      headword: 'ἀρετή',
      polytonic: 'ἀρετή',
      pronunciation: 'a-re-TAY',
      pos: 'noun, feminine',
      lsj: '234',
      definitions: [
        { sense: 'I', definition: 'excellence of any kind', citations: ['Hom. Il. 20.411'] },
        { sense: 'II', definition: 'moral virtue', citations: ['Pl. Men. 70a', 'Arist. EN 1103a'] },
        { sense: 'III', definition: 'valour, prowess', citations: ['Thuc. 2.40'] }
      ],
      etymology: {
        root: '√ar-',
        cognates: ['ἄριστος (best)', 'ἀρέσκω (to please)', 'ἁρμόζω (to fit)'],
        development: 'From ἄρω "to fit" → excellence, virtue',
        semanticShift: 'physical excellence → moral excellence → philosophical virtue'
      },
      paradigm: [
        { case: 'Nom.', singular: 'ἀρετή', plural: 'ἀρεταί' },
        { case: 'Gen.', singular: 'ἀρετῆς', plural: 'ἀρετῶν' },
        { case: 'Dat.', singular: 'ἀρετῇ', plural: 'ἀρεταῖς' },
        { case: 'Acc.', singular: 'ἀρετήν', plural: 'ἀρετάς' },
        { case: 'Voc.', singular: 'ἀρετή', plural: 'ἀρεταί' }
      ],
      manuscripts: [
        { ms: 'P.Oxy. 15', variant: 'αρετη', note: 'no breathings', date: '2nd c. CE' },
        { ms: 'Cod. Sinait.', variant: 'ἀρετή', note: 'full diacritics', date: '4th c. CE' }
      ],
      frequency: 0.72,
      era: 'Classical',
      semanticDrift: [
        { period: 'Archaic', meaning: 'physical excellence', strength: 0.85 },
        { period: 'Classical', meaning: 'moral virtue', strength: 0.9 },
        { period: 'Hellenistic', meaning: 'philosophical virtue', strength: 0.7 }
      ],
      wordEmbeddings: [
        { word: 'καλός', similarity: 0.75, meaning: 'beautiful' },
        { word: 'ἀγαθός', similarity: 0.80, meaning: 'good' },
        { word: 'δίκη', similarity: 0.68, meaning: 'justice' }
      ]
    },
  ];

  const filteredEntries = lexiconEntries.filter(entry =>
    entry.headword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWordClick = useCallback((id) => {
    setSelectedWord(lexiconEntries.find(entry => entry.id === id));
  }, [lexiconEntries]);


  const EraColorMap = {
    'Archaic': '#D97706',
    'Classical': '#F59E0B',
    'Hellenistic': '#3B82F6',
    'Imperial': '#DC2626',
    'Late Antique': '#7C3AED',
    'Byzantine': '#059669'
  };


  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', padding: '20px', transition: 'background-color 0.3s ease' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#C9A227', textAlign: 'center' }}>
        Logos Lexicon
      </h1>

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Search for a word..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#1E1E24',
            color: '#F5F4F2',
            width: '300px',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Word List */}
        <div style={{ backgroundColor: '#1E1E24', padding: '15px', borderRadius: '10px', transition: 'background-color 0.3s ease' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#C9A227' }}>Word List</h2>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {filteredEntries.map((entry) => (
              <li
                key={entry.id}
                onClick={() => handleWordClick(entry.id)}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #141419',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease, color 0.3s ease',
                  backgroundColor: selectedWord?.id === entry.id ? '#141419' : 'transparent',
                  color: selectedWord?.id === entry.id ? '#C9A227' : '#F5F4F2'
                }}
              >
                {entry.headword} ({entry.polytonic})
              </li>
            ))}
          </ul>
        </div>

        {/* Word Details */}
        <div style={{ backgroundColor: '#1E1E24', padding: '15px', borderRadius: '10px', transition: 'background-color 0.3s ease' }}>
          {selectedWord ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <h2 style={{ fontSize: '2rem', color: '#C9A227', marginBottom: '5px' }}>{selectedWord.headword}</h2>
                  <p style={{ color: '#9CA3AF' }}>{selectedWord.polytonic} ({selectedWord.pronunciation})</p>
                  <p style={{ color: '#9CA3AF' }}>Part of Speech: {selectedWord.pos}</p>
                </div>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: EraColorMap[selectedWord.era] || '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#0D0D0F',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>
                  {selectedWord.era[0]}
                </div>
              </div>


              <div style={{ display: 'flex', marginBottom: '15px' }}>
                <button
                  onClick={() => setActiveTab('definition')}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '5px 0 0 5px',
                    backgroundColor: activeTab === 'definition' ? '#C9A227' : '#141419',
                    color: activeTab === 'definition' ? '#0D0D0F' : '#F5F4F2',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}
                >
                  Definition
                </button>
                <button
                  onClick={() => setActiveTab('etymology')}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    backgroundColor: activeTab === 'etymology' ? '#C9A227' : '#141419',
                    color: activeTab === 'etymology' ? '#0D0D0F' : '#F5F4F2',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}
                >
                  Etymology
                </button>
                <button
                  onClick={() => setActiveTab('paradigm')}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '0 5px 5px 0',
                    backgroundColor: activeTab === 'paradigm' ? '#C9A227' : '#141419',
                    color: activeTab === 'paradigm' ? '#0D0D0F' : '#F5F4F2',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}
                >
                  Paradigm
                </button>
              </div>

              {activeTab === 'definition' && (
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: '#C9A227', marginBottom: '10px' }}>Definitions</h3>
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {selectedWord.definitions.map((def, index) => (
                      <li key={index} style={{ marginBottom: '10px' }}>
                        <strong style={{ color: '#F5F4F2' }}>{def.sense}:</strong> {def.definition}
                        <ul style={{ listStyleType: 'none', padding: 0, marginTop: '5px' }}>
                          {def.citations.map((citation, i) => (
                            <li key={i} style={{ color: '#9CA3AF' }}>Citation: {citation}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'etymology' && (
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: '#C9A227', marginBottom: '10px' }}>Etymology</h3>
                  <p style={{ color: '#F5F4F2' }}>
                    <strong style={{ color: '#9CA3AF' }}>Root:</strong> {selectedWord.etymology.root}
                  </p>
                  <p style={{ color: '#F5F4F2' }}>
                    <strong style={{ color: '#9CA3AF' }}>Cognates:</strong> {selectedWord.etymology.cognates.join(', ')}
                  </p>
                  <p style={{ color: '#F5F4F2' }}>
                    <strong style={{ color: '#9CA3AF' }}>Development:</strong> {selectedWord.etymology.development}
                  </p>
                  <p style={{ color: '#F5F4F2' }}>
                    <strong style={{ color: '#9CA3AF' }}>Semantic Shift:</strong> {selectedWord.etymology.semanticShift}
                  </p>
                </div>
              )}

              {activeTab === 'paradigm' && (
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: '#C9A227', marginBottom: '10px' }}>Paradigm</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#141419', color: '#9CA3AF' }}>
                        <th style={{ padding: '8px', border: '1px solid #6B7280', textAlign: 'left' }}>Case</th>
                        <th style={{ padding: '8px', border: '1px solid #6B7280', textAlign: 'left' }}>Singular</th>
                        <th style={{ padding: '8px', border: '1px solid #6B7280', textAlign: 'left' }}>Plural</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedWord.paradigm.map((row, index) => (
                        <tr key={index} style={{ backgroundColor: index % 2 === 0 ? 'transparent' : '#141419' }}>
                          <td style={{ padding: '8px', border: '1px solid #6B7280', color: '#F5F4F2' }}>{row.case}</td>
                          <td style={{ padding: '8px', border: '1px solid #6B7280', color: '#F5F4F2' }}>{row.singular}</td>
                          <td style={{ padding: '8px', border: '1px solid #6B7280', color: '#F5F4F2' }}>{row.plural}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </>
          ) : (
            <p style={{ color: '#9CA3AF', textAlign: 'center' }}>Select a word to see details.</p>
          )}
        </div>
      </div>
    </div>
  );
}