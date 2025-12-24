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
      criticalApparatus: "Manuscript evidence shows consistent transmission of Homeric formula across Christian adaptations with minimal semantic shift.",
      keyWords: ['οἶνοψ', 'πόντος', 'Homer', 'baptism', 'Christian hymns'],
    },
    {
      id: 2,
      title: "The Estrangement of the Soul: From Legal Term to Spiritual Metaphor",
      type: "Semantic",
      language: "Greek",
      confidence: 91,
      novelty: 85,
      era: "Late Antique",
      impact: "Significant",
      description: "ἀλλοτριόω transitions from a legal term meaning 'to alienate property' in classical texts to describing the soul's estrangement from God in late antique theological works.",
      criticalApparatus: "Analysis reveals semantic broadening, influenced by Neoplatonic thought and ascetic ideals, reflected in writings of early Church Fathers.",
      keyWords: ['ἀλλοτριόω', 'alienation', 'soul', 'Neoplatonism', 'Church Fathers'],
    },
  ];

  const filteredDiscoveries = DISCOVERIES.filter(discovery => {
    if (selectedType === 'All' && selectedEra === 'All') return discovery;
    if (selectedType !== 'All' && selectedEra === 'All') return discovery.type === selectedType;
    if (selectedType === 'All' && selectedEra !== 'All') return discovery.era === selectedEra;
    return discovery.type === selectedType && discovery.era === selectedEra;
  });

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', transition: 'background-color 0.3s, color 0.3s' }}>
      <header style={{ width: '100%', maxWidth: '1200px', marginBottom: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#C9A227', textShadow: '1px 1px 2px #000' }}>Logos Discovery Engine</h1>
        <p style={{ color: '#9CA3AF', fontSize: '1.1em' }}>Uncovering Hidden Connections in Ancient Texts</p>
      </header>

      <main style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Filters */}
        <section style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '15px', backgroundColor: '#1E1E24', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', transition: 'background-color 0.3s' }}>
          <div>
            <label htmlFor="type-filter" style={{ color: '#F5F4F2', marginRight: '10px' }}>Type:</label>
            <select id="type-filter" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#141419', color: '#F5F4F2', border: 'none', cursor: 'pointer', transition: 'background-color 0.3s, color 0.3s' }}>
              {DISCOVERY_TYPES.map(type => (
                <option key={type} value={type} style={{ backgroundColor: '#141419', color: '#F5F4F2' }}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="era-filter" style={{ color: '#F5F4F2', marginRight: '10px' }}>Era:</label>
            <select id="era-filter" value={selectedEra} onChange={(e) => setSelectedEra(e.target.value)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#141419', color: '#F5F4F2', border: 'none', cursor: 'pointer', transition: 'background-color 0.3s, color 0.3s' }}>
              <option value="All" style={{ backgroundColor: '#141419', color: '#F5F4F2' }}>All Eras</option>
              {Object.keys(ERA_COLORS).map(era => (
                <option key={era} value={era} style={{ backgroundColor: '#141419', color: '#F5F4F2' }}>{era}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="confidence-filter" style={{ color: '#F5F4F2', marginRight: '10px' }}>Confidence (%):</label>
            <input
              type="number"
              id="confidence-filter"
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(parseInt(e.target.value))}
              min="0"
              max="100"
              style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#141419', color: '#F5F4F2', border: 'none', width: '60px', transition: 'background-color 0.3s, color 0.3s' }}
            />
          </div>
        </section>

        {/* Discoveries List */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredDiscoveries.map(discovery => (
            <div key={discovery.id} style={{ backgroundColor: '#1E1E24', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', transition: 'background-color 0.3s', cursor: 'pointer' }} onClick={() => setExpandedDiscovery(expandedDiscovery === discovery.id ? null : discovery.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2 style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#F5F4F2', transition: 'color 0.3s' }}>{discovery.title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: ERA_COLORS[discovery.era], fontWeight: 'bold', fontSize: '0.9em', padding: '5px 10px', borderRadius: '5px' }}>{discovery.era}</span>
                  <span style={{ color: discovery.language === 'Greek' ? '#3B82F6' : '#DC2626', fontWeight: 'bold', fontSize: '0.9em' }}>{discovery.language === 'Greek' ? 'Α' : 'L'}</span>
                </div>
              </div>
              <p style={{ color: '#9CA3AF', lineHeight: '1.6', transition: 'color 0.3s' }}>{discovery.description}</p>

              {expandedDiscovery === discovery.id && (
                <div style={{ marginTop: '15px', borderTop: '1px solid #6B7280', paddingTop: '15px' }}>
                  <h3 style={{ color: '#F5F4F2', fontSize: '1.2em', marginBottom: '10px' }}>Critical Apparatus</h3>
                  <p style={{ color: '#9CA3AF', lineHeight: '1.6' }}>{discovery.criticalApparatus}</p>
                  <h4 style={{ color: '#F5F4F2', fontSize: '1.1em', marginTop: '10px' }}>Keywords</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {discovery.keyWords.map(word => (
                      <span key={word} style={{ backgroundColor: '#141419', color: '#F5F4F2', padding: '5px 8px', borderRadius: '5px', fontSize: '0.85em' }}>{word}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      </main>

      <footer style={{ width: '100%', maxWidth: '1200px', marginTop: '30px', padding: '20px', textAlign: 'center', color: '#6B7280' }}>
        <p>&copy; 2024 Logos Project. All rights reserved.</p>
      </footer>
    </div>
  );
}