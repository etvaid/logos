'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DiscoveryEngine() {
  const [selectedType, setSelectedType] = useState('All');
  const [expandedDiscovery, setExpandedDiscovery] = useState(null);
  const [selectedEvidence, setSelectedEvidence] = useState({});
  const [hoveredWord, setHoveredWord, ] = useState(null);
  const [activeManuscript, setActiveManuscript] = useState(null);
  const [showParadigm, setShowParadigm] = useState({});
  const [activeWordAnalysis, setActiveWordAnalysis] = useState(null);
  const [analysisView, setAnalysisView] = useState('semantic');
  const [confidenceFilter, setConfidenceFilter] = useState(80);
  const [selectedEra, setSelectedEra] = useState('All');

  const DISCOVERY_TYPES = ['All', 'Pattern', 'Influence', 'Intertextuality', 'Semantic', 'Syntax', 'Manuscript'];

  const ERA_COLORS = {
    'Archaic': '#D97706',
    'Classical': '#F59E0B',
    'Hellenistic': '#3B82F6',
    'Imperial': '#DC2626',
    'Late Antique': '#7C3AED',
    'Byzantine': '#059669'
  };

  const MANUSCRIPT_VARIANTS = {
    1: [
      { ms: 'P.Oxy. 3679', reading: 'οἶνοπα', confidence: 95, date: '3rd cent. CE', hand: 'Square uncials', location: 'Oxyrhynchus' },
      { ms: 'Cod. Venetus A', reading: 'οἴνοπα', confidence: 88, date: '10th cent.', hand: 'Minuscule', location: 'Venice' },
      { ms: 'Cod. Laurentianus', reading: 'οἶνωπα', confidence: 76, date: '11th cent.', hand: 'Minuscule', location: 'Florence' }
    ],
    2: [
      { ms: 'P.Berol. 13270', reading: 'ἀλλοτριωθῆναι', confidence: 92, date: '2nd cent. CE', location: 'Berlin' },
      { ms: 'Cod. Parisinus', reading: 'ἀλλοτριοῦσθαι', confidence: 85, date: '9th cent.', location: 'Paris' }
    ],
    3: [
      { ms: 'P.Vindob. G 40611', reading: 'μετεμψύχωσις', confidence: 89, date: '4th cent. CE', location: 'Vienna' },
      { ms: 'Cod. Vat. gr. 1', reading: 'μετενσωμάτωσις', confidence: 82, date: '12th cent.', location: 'Vatican' }
    ]
  };

  const WORD_ANALYSIS = {
    'οἶνοψ': {
      etymology: 'οἶνος (wine) + ὤψ (appearance, eye)',
      lsj: 'wine-looking, wine-dark, wine-colored; epithet of sea in Homer',
      frequency: { homer: 17, archaic: 23, classical: 8, hellenistic: 12, imperial: 15 },
      semanticDrift: [
        { period: 'Archaic', meaning: 'literal wine-color', confidence: 91, usage: 'Descriptive', color: '#D97706' },
        { period: 'Classical', meaning: 'poetic sea epithet', confidence: 87, usage: 'Formulaic', color: '#F59E0B' },
        { period: 'Hellenistic', meaning: 'literary archaism', confidence: 73, usage: 'Allusive', color: '#3B82F6' },
        { period: 'Imperial', meaning: 'mystery/depth metaphor', confidence: 82, usage: 'Symbolic', color: '#DC2626' }
      ],
      embeddings: [
        { word: 'οἶνοψ', x: 50, y: 40, similarity: 1.0, color: '#F59E0B', freq: 17 },
        { word: 'πόντος', x: 65, y: 35, similarity: 0.89, color: '#3B82F6', freq: 234 },
        { word: 'θάλασσα', x: 70, y: 50, similarity: 0.82, color: '#3B82F6', freq: 187 },
        { word: 'μυστήριον', x: 35, y: 60, similarity: 0.78, color: '#7C3AED', freq: 89 },
        { word: 'βάθος', x: 55, y: 65, similarity: 0.74, color: '#DC2626', freq: 145 },
        { word: 'χρῶμα', x: 25, y: 45, similarity: 0.71, color: '#D97706', freq: 67 }
      ]
    },
    'ἀλλοτριόω': {
      etymology: 'ἀλλότριος (foreign, strange) + -όω (denominative suffix)',
      lsj: 'to estrange, alienate; make foreign; transfer ownership',
      frequency: { classical: 45, hellenistic: 67, imperial: 89, late: 134 },
      semanticDrift: [
        { period: 'Classical', meaning: 'legal alienation', confidence: 94, usage: 'Technical', color: '#F59E0B' },
        { period: 'Hellenistic', meaning: 'social estrangement', confidence: 88, usage: 'Extended', color: '#3B82F6' },
        { period: 'Imperial', meaning: 'philosophical detachment', confidence: 85, usage: 'Abstract', color: '#DC2626' },
        { period: 'Late Antique', meaning: 'spiritual alienation', confidence: 91, usage: 'Theological', color: '#7C3AED' }
      ]
    }
  };

  const PARADIGM_TABLES = {
    'οἶνοψ': {
      type: 'Adjective (3rd declension, two-termination)',
      forms: [
        { case: 'Nom.', masc: 'οἶνοψ', fem: 'οἶνοψ', neut: 'οἶνοπ', pl_m: 'οἶνοπες', pl_f: 'οἶνοπες', pl_n: 'οἶνοπα' },
        { case: 'Gen.', masc: 'οἴνοπος', fem: 'οἴνοπος', neut: 'οἴνοπος', pl_m: 'οἰνόπων', pl_f: 'οἰνόπων', pl_n: 'οἰνόπων' },
        { case: 'Dat.', masc: 'οἴνοπι', fem: 'οἴνοπι', neut: 'οἴνοπι', pl_m: 'οἴνοψι(ν)', pl_f: 'οἴνοψι(ν)', pl_n: 'οἴνοψι(ν)' },
        { case: 'Acc.', masc: 'οἶνοπα', fem: 'οἶνοπα', neut: 'οἶνοπ', pl_m: 'οἶνοπας', pl_f: 'οἶνοπας', pl_n: 'οἶνοπα' }
      ]
    },
    'ἀλλοτριόω': {
      type: 'Contract verb (-όω)',
      forms: [
        { tense: 'Present', first: 'ἀλλοτριῶ', second: 'ἀλλοτριοῖς', third: 'ἀλλοτριοῖ', pl1: 'ἀλλοτριοῦμεν', pl2: 'ἀλλοτριοῦτε', pl3: 'ἀλλοτριοῦσι(ν)' },
        { tense: 'Imperfect', first: 'ἠλλοτρίουν', second: 'ἠλλοτρίους', third: 'ἠλλοτρίου', pl1: 'ἠλλοτριοῦμεν', pl2: 'ἠλλοτριοῦτε', pl3: 'ἠλλοτρίουν' },
        { tense: 'Future', first: 'ἀλλοτριώσω', second: 'ἀλλοτριώσεις', third: 'ἀλλοτριώσει', pl1: 'ἀλλοτριώσομεν', pl2: 'ἀλλοτριώσετε', pl3: 'ἀλλοτριώσουσι(ν)' },
        { tense: 'Aorist', first: 'ἠλλοτρίωσα', second: 'ἠλλοτρίωσας', third: 'ἠλλοτρίωσε(ν)', pl1: 'ἠλλοτριώσαμεν', pl2: 'ἠλλοτριώσατε', pl3: 'ἠλλοτρίωσαν' }
      ]
    }
  };

  const DISCOVERIES = [
    {
      id: 1,
      title: "Homer's Wine-Dark Sea in Christian Hymns",
      type: "Pattern",
      language: "Greek",
      confidence: 87,
      novelty: 92,
      era: "Imperial",
      impact: "Revolutionary",
      description: "οἶνοψ πόντος (wine-dark sea) appears 17 times in Homer, but LOGOS found 3 instances in 4th century Christian hymns describing baptismal waters.",
      criticalApparatus: "Manuscript evidence shows consistent transmission of Homeric formula across Christian adaptations with minima",
      words: ['οἶνοψ', 'πόντος']
    },
    {
      id: 2,
      title: "The Evolving Meaning of Alienation",
      type: "Semantic",
      language: "Greek",
      confidence: 91,
      novelty: 78,
      era: "Late Antique",
      impact: "Significant",
      description: "The term ἀλλοτριόω (to alienate) undergoes a semantic shift from legal contexts to philosophical and spiritual alienation during the Late Antique period.",
      criticalApparatus: "Analysis of patristic texts reveals the adoption of ἀλλοτριόω in discussions of human separation from God.",
      words: ['ἀλλοτριόω']
    },
    {
      id: 3,
      title: "Reincarnation Concepts",
      type: "Intertextuality",
      language: "Greek",
      confidence: 70,
      novelty: 60,
      era: "Hellenistic",
      impact: "Informative",
      description: "Concepts of reincarnation as expressed through words such as μετεμψύχωσις and μετενσωμάτωσις.",
      criticalApparatus: "Analysis of various texts shows intertextual connections and the evolution of related concepts.",
      words: ['μετεμψύχωσις', 'μετενσωμάτωσις']
    }
  ];

  const filteredDiscoveries = DISCOVERIES.filter(discovery => {
    if (selectedType === 'All' && selectedEra === 'All') return true;
    if (selectedType !== 'All' && selectedEra === 'All') return discovery.type === selectedType;
    if (selectedType === 'All' && selectedEra !== 'All') return discovery.era === selectedEra;
    return discovery.type === selectedType && discovery.era === selectedEra;
  }).filter(discovery => discovery.confidence >= confidenceFilter);

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', padding: '20px', transition: 'background-color 0.3s ease' }}>
      <header style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #1E1E24' }}>
        <h1 style={{ fontSize: '2em', fontWeight: 'bold', color: '#C9A227', transition: 'color 0.3s ease' }}>LOGOS Discovery Engine</h1>
        <p style={{ color: '#9CA3AF', fontSize: '1.1em', transition: 'color 0.3s ease' }}>Uncovering connections in ancient texts.</p>
      </header>

      <section style={{ display: 'flex', marginBottom: '20px' }}>
        <div style={{ width: '250px', marginRight: '20px', padding: '15px', backgroundColor: '#1E1E24', borderRadius: '8px', transition: 'background-color 0.3s ease' }}>
          <h3 style={{ color: '#F5F4F2', marginBottom: '10px', transition: 'color 0.3s ease' }}>Filters</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#9CA3AF', marginBottom: '5px', transition: 'color 0.3s ease' }}>Type:</label>
            <select
              style={{ width: '100%', padding: '8px', backgroundColor: '#141419', color: '#F5F4F2', border: 'none', borderRadius: '4px', transition: 'background-color 0.3s ease, color 0.3s ease' }}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {DISCOVERY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#9CA3AF', marginBottom: '5px', transition: 'color 0.3s ease' }}>Era:</label>
            <select
              style={{ width: '100%', padding: '8px', backgroundColor: '#141419', color: '#F5F4F2', border: 'none', borderRadius: '4px', transition: 'background-color 0.3s ease, color 0.3s ease' }}
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value)}
            >
              <option value="All">All Eras</option>
              {Object.keys(ERA_COLORS).map(era => (
                <option key={era} value={era}>{era}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: '#9CA3AF', marginBottom: '5px', transition: 'color 0.3s ease' }}>Confidence (%):</label>
            <input
              type="range"
              min="0"
              max="100"
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(parseInt(e.target.value))}
              style={{ width: '100%', transition: 'opacity 0.3s ease' }}
            />
            <span style={{ color: '#9CA3AF', fontSize: '0.9em', transition: 'color 0.3s ease' }}>{confidenceFilter}%</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ color: '#F5F4F2', marginBottom: '15px', transition: 'color 0.3s ease' }}>Discoveries</h2>
          {filteredDiscoveries.length === 0 ? (
            <p style={{ color: '#9CA3AF', transition: 'color 0.3s ease' }}>No discoveries found with the selected filters.</p>
          ) : (
            filteredDiscoveries.map(discovery => (
              <div
                key={discovery.id}
                style={{
                  backgroundColor: '#1E1E24',
                  padding: '15px',
                  marginBottom: '15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                  transform: expandedDiscovery === discovery.id ? 'scale(1.02)' : 'scale(1)',
                }}
                onClick={() => setExpandedDiscovery(expandedDiscovery === discovery.id ? null : discovery.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ color: '#F5F4F2', margin: 0, transition: 'color 0.3s ease' }}>{discovery.title}</h3>
                  <span style={{
                    color: '#F5F4F2',
                    fontSize: '0.8em',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    backgroundColor: ERA_COLORS[discovery.era],
                    transition: 'background-color 0.3s ease, color 0.3s ease'
                  }}>
                    {discovery.era}
                  </span>
                </div>
                <p style={{ color: '#9CA3AF', transition: 'color 0.3s ease' }}>{discovery.description}</p>
                {expandedDiscovery === discovery.id && (
                  <div style={{ marginTop: '10px', borderTop: '1px solid #141419', paddingTop: '10px' }}>
                    <p style={{ color: '#6B7280', fontStyle: 'italic', transition: 'color 0.3s ease' }}>{discovery.criticalApparatus}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
                      {discovery.words.map(word => (
                        <button
                          key={word}
                          style={{
                            backgroundColor: hoveredWord === word ? '#C9A227' : '#334155',
                            color: '#F5F4F2',
                            border: 'none',
                            padding: '8px 12px',
                            marginRight: '8px',
                            marginBottom: '8px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease, color 0.3s ease',
                          }}
                          onMouseEnter={() => setHoveredWord(word)}
                          onMouseLeave={() => setHoveredWord(null)}
                          onClick={() => setActiveWordAnalysis(word)}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {activeWordAnalysis && (
        <div style={{ backgroundColor: '#1E1E24', padding: '20px', borderRadius: '8px', marginBottom: '20px', transition: 'background-color 0.3s ease' }}>
          <h2 style={{ color: '#F5F4F2', marginBottom: '15px', transition: 'color 0.3s ease' }}>Word Analysis: {activeWordAnalysis}</h2>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: '1' }}>
              <h3 style={{ color: '#F5F4F2', marginBottom: '10px', transition: 'color 0.3s ease' }}>Etymology</h3>
              <p style={{ color: '#9CA3AF', transition: 'color 0.3s ease' }}>{WORD_ANALYSIS[activeWordAnalysis]?.etymology || 'No etymology found.'}</p>

              <h3 style={{ color: '#F5F4F2', marginTop: '20px', marginBottom: '10px', transition: 'color 0.3s ease' }}>LSJ Definition</h3>
              <p style={{ color: '#9CA3AF', transition: 'color 0.3s ease' }}>{WORD_ANALYSIS[activeWordAnalysis]?.lsj || 'No LSJ definition found.'}</p>

              <h3 style={{ color: '#F5F4F2', marginTop: '20px', marginBottom: '10px', transition: 'color 0.3s ease' }}>Frequency</h3>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {WORD_ANALYSIS[activeWordAnalysis]?.frequency ? Object.entries(WORD_ANALYSIS[activeWordAnalysis].frequency).map(([period, frequency]) => (
                  <li key={period} style={{ color: '#9CA3AF', transition: 'color 0.3s ease' }}>{period}: {frequency}</li>
                )) : <li style={{ color: '#9CA3AF', transition: 'color 0.3s ease' }}>No frequency data found.</li>}
              </ul>
            </div>

            <div style={{ flex: '1' }}>
              <h3 style={{ color: '#F5F4F2', marginBottom: '10px', transition: 'color 0.3s ease' }}>Semantic Drift</h3>
              {WORD_ANALYSIS[activeWordAnalysis]?.semanticDrift ? (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {WORD_ANALYSIS[activeWordAnalysis].semanticDrift.map((drift, index) => (
                    <li key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#141419', borderRadius: '5px', transition: 'background-color 0.3s ease' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <span style={{ color: '#F5F4F2', fontWeight: 'bold', transition: 'color 0.3s ease' }}>{drift.period}</span>
                        <span style={{ color: drift.color, transition: 'color 0.3s ease' }}>Confidence: {drift.confidence}%</span>
                      </div>
                      <p style={{ color: '#9CA3AF', transition: 'color 0.3s ease' }}>Meaning: {drift.meaning}</p>
                      <p style={{ color: '#6B7280', fontStyle: 'italic', transition: 'color 0.3s ease' }}>Usage: {drift.usage}</p>
                    </li>
                  ))}
                </ul>
              ) : <p style={{ color: '#9CA3AF', transition: 'color 0.3s ease' }}>No semantic drift data found.</p>}
            </div>
          </div>
                    
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#F5F4F2', marginBottom: '10px', transition: 'color 0.3s ease' }}>Word Embeddings</h3>
            {WORD_ANALYSIS[activeWordAnalysis]?.embeddings ? (
              <svg width="400" height="300" style={{ border: '1px solid #6B7280', transition: 'border-color 0.3s ease' }}>
                {WORD_ANALYSIS[activeWordAnalysis].embeddings.map((embedding, index) => (
                  <g key={index}>
                    <circle cx={embedding.x} cy={embedding.y} r={embedding.similarity * 10} fill={embedding.color} opacity="0.7" style={{ transition: 'fill 0.3s ease' }}/>
                    <text x={embedding.x + 12} y={embedding.y + 4} fill="#F5F4F2" fontSize="0.8em" style={{ transition: 'fill 0.3s ease' }}>{embedding.word}</text>
                  </g>
                ))}
              </svg>
            ) : <p style={{ color: '#9CA3AF', transition: 'color 0.3s ease' }}>No word embedding data found.</p>}
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#F5F4F2', marginBottom: '10px', transition: 'color 0.3s ease' }}>Paradigm</h3>
            {PARADIGM_TABLES[activeWordAnalysis] ? (
              <>
                <p style={{ color: '#9CA3AF', transition: 'color 0.3s ease' }}>Type: {PARADIGM_TABLES[activeWordAnalysis].type}</p>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {Object.keys(PARADIGM_TABLES[activeWordAnalysis].forms[0]).map(header => (
                        <th key={header} style={{
                          padding: '8px',
                          border: '1px solid #141419',
                          textAlign: 'left',
                          color: '#9CA3AF',
                          backgroundColor: '#141419',
                          transition: 'background-color 0.3s ease, color 0.3s ease'
                        }}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PARADIGM_TABLES[activeWordAnalysis].forms.map((form, index) => (
                      <tr key={index} style={{transition: 'background-color 0.3s ease',}}>
                        {Object.values(form).map((value, i) => (
                          <td key={i} style={{
                            padding: '8px',
                            border: '1px solid #141419',
                            color: '#F5F4F2',
                            transition: 'color 0.3s ease'
                          }}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : <p style={{ color: '#9CA3AF', transition: 'color 0.3s ease' }}>No paradigm data found.</p>}
          </div>

          <button
            style={{
              backgroundColor: '#334155',
              color: '#F5F4F2',
              border: 'none',
              padding: '8px 12px',
              marginTop: '20px',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, color 0.3s ease',
            }}
            onClick={() => setActiveWordAnalysis(null)}
          >
            Close Analysis
          </button>
        </div>
      )}

      <footer style={{ marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #1E1E24', textAlign: 'center', color: '#9CA3AF', transition: 'color 0.3s ease' }}>
        <p>© 2024 LOGOS Project</p>
      </footer>
    </div>
  );
}