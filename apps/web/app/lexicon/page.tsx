'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';

export default function Lexicon() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord,
  ] = useState < null | {
    id: number;
    headword: string;
    polytonic: string;
    pronunciation: string;
    pos: string;
    lsj: string;
    definitions: { sense: string; definition: string; citations: string[] }[];
    etymology: { root: string; cognates: string[]; development: string; semanticShift: string };
    paradigm: { case: string; singular: string; plural: string }[];
    manuscripts: { ms: string; variant: string; note: string; date: string }[];
    frequency: number;
    era: string;
    semanticDrift: { period: string; meaning: string; strength: number }[];
    wordEmbeddings: { word: string; similarity: number; meaning: string }[];
  } > (null);
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
        { period: 'Archaic', meaning: 'physical prowess', strength: 0.8 },
        { period: 'Classical', meaning: 'moral excellence', strength: 0.9 },
        { period: 'Hellenistic', meaning: 'philosophical virtue', strength: 0.7 }
      ],
      wordEmbeddings: [
        { word: 'ἀνδρεία', similarity: 0.88, meaning: 'courage' },
        { word: 'σωφροσύνη', similarity: 0.81, meaning: 'temperance' },
        { word: 'δικαιοσύνη', similarity: 0.75, meaning: 'justice' }
      ]
    }
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredEntries = lexiconEntries.filter(entry =>
    entry.headword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWordClick = (id: number) => {
    const word = lexiconEntries.find(entry => entry.id === id);
    setSelectedWord(word || null);
  };

  const renderSemanticDriftChart = useCallback((semanticDrift: { period: string; meaning: string; strength: number }[]) => {
    const periods = semanticDrift.map(item => item.period);
    const strengths = semanticDrift.map(item => item.strength);

    const svgWidth = 300;
    const svgHeight = 150;
    const margin = 20;
    const barWidth = (svgWidth - 2 * margin) / periods.length;
    const maxStrength = Math.max(...strengths);

    return (
      <svg width={svgWidth} height={svgHeight} style={{ overflow: 'visible' }}>
        {semanticDrift.map((item, index) => {
          const barHeight = (item.strength / maxStrength) * (svgHeight - 2 * margin);
          const x = margin + index * barWidth;
          const y = svgHeight - margin - barHeight;
          const eraColor =
            item.period === 'Archaic' ? '#D97706' :
              item.period === 'Classical' ? '#F59E0B' :
                item.period === 'Hellenistic' ? '#3B82F6' :
                  item.period === 'Imperial' ? '#DC2626' :
                    item.period === 'Late Antique' ? '#7C3AED' :
                      '#059669'; // Byzantine
          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth - 2}
                height={barHeight}
                fill={eraColor}
                style={{ transition: 'height 0.3s ease' }}
              />
              <text
                x={x + barWidth / 2}
                y={svgHeight - 5}
                textAnchor="middle"
                fontSize="8"
                fill="#9CA3AF"
              >
                {item.period}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }, []);


  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2em', marginBottom: '20px', color: '#C9A227' }}>
        Logos Lexicon
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search words..."
          value={searchQuery}
          onChange={handleSearch}
          style={{
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #6B7280',
            backgroundColor: '#1E1E24',
            color: '#F5F4F2',
            width: 'calc(100% - 22px)',
            transition: 'all 0.3s ease'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: '1', overflow: 'auto' }}>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {filteredEntries.map(entry => (
              <li
                key={entry.id}
                style={{
                  padding: '10px',
                  marginBottom: '5px',
                  backgroundColor: '#1E1E24',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  ':hover': { backgroundColor: '#334155' },
                }}
                onClick={() => handleWordClick(entry.id)}
              >
                <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>{entry.headword}</span>
                <span style={{ color: '#9CA3AF', marginLeft: '10px' }}>({entry.pronunciation})</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: '2', backgroundColor: '#1E1E24', padding: '20px', borderRadius: '5px', position: 'relative' }}>
          {selectedWord ? (
            <>
              <h2 style={{ fontSize: '1.5em', color: '#C9A227', marginBottom: '10px' }}>
                {selectedWord.polytonic}
                <span style={{ fontSize: '0.8em', color: '#9CA3AF', marginLeft: '10px' }}>({selectedWord.pronunciation})</span>
              </h2>
              <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Part of Speech:</span> {selectedWord.pos}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                <button
                  style={{
                    backgroundColor: activeTab === 'definition' ? '#3B82F6' : '#141419',
                    color: '#F5F4F2',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                  onClick={() => setActiveTab('definition')}
                >
                  Definition
                </button>
                <button
                  style={{
                    backgroundColor: activeTab === 'etymology' ? '#3B82F6' : '#141419',
                    color: '#F5F4F2',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                  onClick={() => setActiveTab('etymology')}
                >
                  Etymology
                </button>
                <button
                  style={{
                    backgroundColor: activeTab === 'paradigm' ? '#3B82F6' : '#141419',
                    color: '#F5F4F2',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                  onClick={() => setActiveTab('paradigm')}
                >
                  Paradigm
                </button>
                <button
                  style={{
                    backgroundColor: activeTab === 'semanticDrift' ? '#3B82F6' : '#141419',
                    color: '#F5F4F2',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                  onClick={() => setActiveTab('semanticDrift')}
                >
                  Semantic Drift
                </button>
              </div>

              {activeTab === 'definition' && (
                <div>
                  {selectedWord.definitions.map((def, index) => (
                    <div key={index} style={{ marginBottom: '15px' }}>
                      <span style={{ fontWeight: 'bold', color: '#C9A227' }}>Sense {def.sense}:</span>
                      <p style={{ color: '#F5F4F2' }}>{def.definition}</p>
                      <p style={{ color: '#9CA3AF' }}>
                        <span style={{ fontStyle: 'italic' }}>Citations:</span> {def.citations.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'etymology' && (
                <div>
                  <p style={{ color: '#F5F4F2', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: '#C9A227' }}>Root:</span> {selectedWord.etymology.root}
                  </p>
                  <p style={{ color: '#F5F4F2', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: '#C9A227' }}>Cognates:</span> {selectedWord.etymology.cognates.join(', ')}
                  </p>
                  <p style={{ color: '#F5F4F2', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: '#C9A227' }}>Development:</span> {selectedWord.etymology.development}
                  </p>
                  <p style={{ color: '#F5F4F2', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: '#C9A227' }}>Semantic Shift:</span> {selectedWord.etymology.semanticShift}
                  </p>
                </div>
              )}

              {activeTab === 'paradigm' && (
                <div>
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
                        <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#1E1E24' : '#141419' }}>
                          <td style={{ padding: '8px', border: '1px solid #6B7280', color: '#F5F4F2' }}>{row.case}</td>
                          <td style={{ padding: '8px', border: '1px solid #6B7280', color: '#F5F4F2' }}>{row.singular}</td>
                          <td style={{ padding: '8px', border: '1px solid #6B7280', color: '#F5F4F2' }}>{row.plural}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'semanticDrift' && (
                <div>
                  <h3 style={{ color: '#C9A227', marginBottom: '10px' }}>Semantic Drift Over Time</h3>
                  {renderSemanticDriftChart(selectedWord.semanticDrift)}
                </div>
              )}

              <p style={{ color: '#6B7280', position: 'absolute', bottom: '10px', right: '10px', fontSize: '0.8em' }}>
                LSJ: {selectedWord.lsj}
              </p>
            </>
          ) : (
            <p style={{ color: '#9CA3AF' }}>Select a word to see its details.</p>
          )}
        </div>
      </div>
    </div>
  );
}