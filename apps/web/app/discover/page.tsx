'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DiscoveryEngine() {
  const [selectedType, setSelectedType] = useState('All');
  const [expandedDiscovery, setExpandedDiscovery] = useState(null);
  const [selectedEvidence, setSelectedEvidence] = useState({});
  const [hoveredWord, setHoveredWord] = useState(null);
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
      criticalApparatus: "Manuscript evidence shows consistent transmission of Homeric formula across Christian adaptations with minimal alterations.",
      evidence: [
        { id: 'ev1', text: 'ὕδατι οἴνοπι ... πόντου', manuscriptVariantsKey: 1 },
        { id: 'ev2', text: 'βαπτίζοντος εἰς θάλασσαν οἰνωπήν', manuscriptVariantsKey: 1 },
        { id: 'ev3', text: 'ἄβυσσος οἶνοψ, μυστηρίων πλήρης', manuscriptVariantsKey: 1 }
      ]
    },
    {
      id: 2,
      title: "Alienation Motif from Law to Theology",
      type: "Semantic",
      language: "Greek",
      confidence: 91,
      novelty: 85,
      era: "Late Antique",
      impact: "Significant",
      description: "The term ἀλλοτριόω undergoes a semantic shift, from legal contexts to describe spiritual alienation in late antiquity.",
      criticalApparatus: "Analysis of legal documents compared with patristic texts reveals evolving connotations of 'otherness'.",
      evidence: [
        { id: 'ev4', text: 'ἀλλοτριωθῆναι τῆς οἰκονομίας', manuscriptVariantsKey: 2 },
        { id: 'ev5', text: 'ἑαυτοὺς ἀλλοτριοῦσθαι τοῦ θεοῦ', manuscriptVariantsKey: 2 },
        { id: 'ev6', text: 'ψυχὴ ἀλλοτριωθεῖσα τῶν θείων', manuscriptVariantsKey: 2 }
      ]
    },
    {
      id: 3,
      title: "Reincarnation Discourse: From Philosophy to Gnosticism",
      type: "Influence",
      language: "Greek",
      confidence: 85,
      novelty: 78,
      era: "Imperial",
      impact: "Moderate",
      description: "The concept of metempsychosis transitions from philosophical discourse in the Imperial era to esoteric Gnostic interpretations.",
      criticalApparatus: "Comparison of Platonic dialogues with Gnostic treatises highlights reinterpretation of soul migration.",
      evidence: [
        { id: 'ev7', text: 'περὶ μετεμψυχώσεως ... δόγματα', manuscriptVariantsKey: 3 },
        { id: 'ev8', text: 'ψυχῆς μετενσωμάτωσις εἰς ἕτερον σῶμα', manuscriptVariantsKey: 3 },
        { id: 'ev9', text: 'ἡ κάθαρσις τῆς ψυχῆς διὰ μετεμψυχώσεως', manuscriptVariantsKey: 3 }
      ]
    }
  ];


  const filteredDiscoveries = DISCOVERIES.filter(discovery => {
    if (selectedType === 'All' && selectedEra === 'All') return true;
    if (selectedType !== 'All' && selectedEra === 'All') return discovery.type === selectedType;
    if (selectedType === 'All' && selectedEra !== 'All') return discovery.era === selectedEra;
    return discovery.type === selectedType && discovery.era === selectedEra;
  });

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', fontFamily: 'sans-serif', minHeight: '100vh', padding: '20px', transition: 'background-color 0.3s' }}>
      <header style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#C9A227', fontSize: '2.5em', fontWeight: 'bold', transition: 'color 0.3s' }}>Logos Discovery Engine</h1>
        <p style={{ color: '#9CA3AF', fontSize: '1.1em', transition: 'color 0.3s' }}>Uncovering Connections in Ancient Texts</p>
      </header>

      <section style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {/* Filters */}
        <div style={{ width: '250px', backgroundColor: '#1E1E24', padding: '15px', borderRadius: '8px', transition: 'background-color 0.3s' }}>
          <h3 style={{ color: '#F5F4F2', marginBottom: '10px', fontWeight: 'bold', transition: 'color 0.3s' }}>Filters</h3>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ color: '#9CA3AF', display: 'block', marginBottom: '5px', transition: 'color 0.3s' }}>Type:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ width: '100%', padding: '8px', backgroundColor: '#141419', color: '#F5F4F2', border: 'none', borderRadius: '4px', transition: 'all 0.3s' }}
            >
              {DISCOVERY_TYPES.map(type => (
                <option key={type} value={type} style={{ backgroundColor: '#141419', color: '#F5F4F2' }}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ color: '#9CA3AF', display: 'block', marginBottom: '5px', transition: 'color 0.3s' }}>Era:</label>
            <select
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value)}
              style={{ width: '100%', padding: '8px', backgroundColor: '#141419', color: '#F5F4F2', border: 'none', borderRadius: '4px', transition: 'all 0.3s' }}
            >
              <option key="All" value="All" style={{ backgroundColor: '#141419', color: '#F5F4F2' }}>All</option>
              {Object.keys(ERA_COLORS).map(era => (
                <option key={era} value={era} style={{ backgroundColor: '#141419', color: '#F5F4F2' }}>{era}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Discoveries List */}
        <div style={{ flex: '1', width: '75%', }}>
          <h2 style={{ color: '#F5F4F2', marginBottom: '15px', transition: 'color 0.3s' }}>Discoveries</h2>
          {filteredDiscoveries.length > 0 ? (
            filteredDiscoveries.map(discovery => (
              <div
                key={discovery.id}
                style={{
                  backgroundColor: '#1E1E24',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  transition: 'background-color 0.3s, transform 0.3s',
                  cursor: 'pointer',
                  borderLeft: `5px solid ${ERA_COLORS[discovery.era as keyof typeof ERA_COLORS] || '#6B7280'}`,
                }}
                onClick={() => setExpandedDiscovery(expandedDiscovery === discovery.id ? null : discovery.id)}
              >
                <h3 style={{ color: '#F5F4F2', fontWeight: 'bold', marginBottom: '5px', transition: 'color 0.3s' }}>{discovery.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{
                    fontSize: '0.8em', color: '#9CA3AF', backgroundColor: ERA_COLORS[discovery.era as keyof typeof ERA_COLORS], padding: '3px 6px', borderRadius: '4px', marginRight: '5px', transition: 'all 0.3s',
                  }}>{discovery.era}</span>
                  <span style={{ fontSize: '0.8em', color: '#9CA3AF', transition: 'color 0.3s' }}>Type: {discovery.type}</span>
                </div>
                <p style={{ color: '#9CA3AF', transition: 'color 0.3s' }}>{discovery.description}</p>

                {expandedDiscovery === discovery.id && (
                  <div style={{ marginTop: '15px', padding: '10px', borderTop: '1px solid #6B7280', transition: 'border-color 0.3s' }}>
                    <h4 style={{ color: '#F5F4F2', fontWeight: 'bold', marginBottom: '10px', transition: 'color 0.3s' }}>Evidence:</h4>
                    <ul style={{ listStyleType: 'none', padding: '0' }}>
                      {discovery.evidence.map(evidenceItem => (
                        <li key={evidenceItem.id} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#141419', borderRadius: '4px', transition: 'background-color 0.3s' }}>
                          <span
                            onMouseEnter={() => setHoveredWord(evidenceItem.text)}
                            onMouseLeave={() => setHoveredWord(null)}
                            onClick={() => {
                              setSelectedEvidence(evidenceItem);
                              setActiveManuscript(evidenceItem.manuscriptVariantsKey);
                            }}
                            style={{ cursor: 'pointer', color: '#F5F4F2', transition: 'color 0.3s' }}>
                            {evidenceItem.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p style={{ color: '#9CA3AF', transition: 'color 0.3s' }}>{discovery.criticalApparatus}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: '#9CA3AF', transition: 'color 0.3s' }}>No discoveries found for the selected filters.</p>
          )}
        </div>
      </section>

      {/* Manuscript Variants Display */}
      {activeManuscript && (
        <section style={{ backgroundColor: '#1E1E24', padding: '20px', borderRadius: '8px', marginBottom: '20px', transition: 'background-color 0.3s' }}>
          <h2 style={{ color: '#F5F4F2', fontWeight: 'bold', marginBottom: '15px', transition: 'color 0.3s' }}>Manuscript Variants</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', transition: 'all 0.3s' }}>
            <thead>
              <tr style={{ backgroundColor: '#141419', color: '#9CA3AF', transition: 'background-color 0.3s, color 0.3s' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Manuscript</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Reading</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Confidence</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Hand</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Location</th>
              </tr>
            </thead>
            <tbody>
              {MANUSCRIPT_VARIANTS[activeManuscript].map((variant, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #6B7280', transition: 'border-color 0.3s' }}>
                  <td style={{ padding: '10px', color: '#F5F4F2', transition: 'color 0.3s' }}>{variant.ms}</td>
                  <td style={{ padding: '10px', color: '#F5F4F2', transition: 'color 0.3s' }}>{variant.reading}</td>
                  <td style={{ padding: '10px', color: '#F5F4F2', transition: 'color 0.3s' }}>{variant.confidence}%</td>
                  <td style={{ padding: '10px', color: '#F5F4F2', transition: 'color 0.3s' }}>{variant.date}</td>
                  <td style={{ padding: '10px', color: '#F5F4F2', transition: 'color 0.3s' }}>{variant.hand}</td>
                  <td style={{ padding: '10px', color: '#F5F4F2', transition: 'color 0.3s' }}>{variant.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Word Analysis */}
      {hoveredWord && WORD_ANALYSIS[hoveredWord] && (
        <section style={{ backgroundColor: '#1E1E24', padding: '20px', borderRadius: '8px', transition: 'background-color 0.3s' }}>
          <h2 style={{ color: '#F5F4F2', fontWeight: 'bold', marginBottom: '15px', transition: 'color 0.3s' }}>Word Analysis: {hoveredWord}</h2>
          <p style={{ color: '#9CA3AF', marginBottom: '10px', transition: 'color 0.3s' }}>Etymology: {WORD_ANALYSIS[hoveredWord].etymology}</p>
          <p style={{ color: '#9CA3AF', marginBottom: '10px', transition: 'color 0.3s' }}>LSJ Definition: {WORD_ANALYSIS[hoveredWord].lsj}</p>

          {/* Semantic Drift Visualization */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#F5F4F2', fontWeight: 'bold', marginBottom: '10px', transition: 'color 0.3s' }}>Semantic Drift</h3>
            <div style={{ position: 'relative', width: '100%', height: '200px' }}>
              <svg width="100%" height="100%">
                {WORD_ANALYSIS[hoveredWord].semanticDrift.map((drift, index) => (
                  <React.Fragment key={index}>
                    <line
                      x1={`${(index / (WORD_ANALYSIS[hoveredWord].semanticDrift.length - 1)) * 100}%`}
                      y1={`${100 - drift.confidence}%`}
                      x2={`${((index + 1) / (WORD_ANALYSIS[hoveredWord].semanticDrift.length - 1)) * 100}%`}
                      y2={`${100 - WORD_ANALYSIS[hoveredWord].semanticDrift[Math.min(index + 1, WORD_ANALYSIS[hoveredWord].semanticDrift.length - 1)].confidence}%`}
                      style={{ stroke: drift.color, strokeWidth: 2, transition: 'stroke 0.3s' }}
                    />
                    <circle
                      cx={`${(index / (WORD_ANALYSIS[hoveredWord].semanticDrift.length - 1)) * 100}%`}
                      cy={`${100 - drift.confidence}%`}
                      r="5"
                      fill={drift.color}
                      style={{ transition: 'fill 0.3s' }}
                    />
                    <title>{`${drift.period}: ${drift.meaning} (${drift.confidence}%)`}</title>
                  </React.Fragment>
                ))}
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-around', position: 'absolute', bottom: '0', width: '100%' }}>
                {WORD_ANALYSIS[hoveredWord].semanticDrift.map((drift, index) => (
                  <span key={index} style={{ color: drift.color, fontSize: '0.8em', fontWeight: 'bold', transition: 'color 0.3s' }}>{drift.period}</span>
                ))}
              </div>
            </div>
          </div>


          {/* Frequency Bar Chart */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#F5F4F2', fontWeight: 'bold', marginBottom: '10px', transition: 'color 0.3s' }}>Frequency by Period</h3>
            <div style={{ display: 'flex', height: '100px', alignItems: 'flex-end', justifyContent: 'space-around' }}>
              {Object.entries(WORD_ANALYSIS[hoveredWord].frequency).map(([period, frequency]) => (
                <div key={period} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      backgroundColor: ERA_COLORS[period as keyof typeof ERA_COLORS],
                      width: '30px',
                      height: `${(frequency / Math.max(...Object.values(WORD_ANALYSIS[hoveredWord].frequency as any))) * 100}px`,
                      marginBottom: '5px',
                      transition: 'all 0.3s',
                    }}
                  />
                  <span style={{ color: '#9CA3AF', fontSize: '0.8em', transition: 'color 0.3s' }}>{period}</span>
                </div>
              ))}
            </div>
          </div>

        </section>
      )}
    </div>
  );
}