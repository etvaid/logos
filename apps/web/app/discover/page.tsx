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

  const DISCOVERY_TYPES = ['All', 'Pattern', 'Influence', 'Intertextuality', 'Semantic', 'Syntax', 'Manuscript'];

  const MANUSCRIPT_VARIANTS = {
    1: [
      { ms: 'P.Oxy. 3679', reading: 'οἶνοπα', confidence: 95, date: '3rd cent. CE', hand: 'Square uncials' },
      { ms: 'Cod. Venetus A', reading: 'οἴνοπα', confidence: 88, date: '10th cent.', hand: 'Minuscule' },
      { ms: 'Cod. Laurentianus', reading: 'οἶνωπα', confidence: 76, date: '11th cent.', hand: 'Minuscule' }
    ],
    2: [
      { ms: 'P.Berol. 13270', reading: 'ἀλλοτριωθῆναι', confidence: 92, date: '2nd cent. CE' },
      { ms: 'Cod. Parisinus', reading: 'ἀλλοτριοῦσθαι', confidence: 85, date: '9th cent.' }
    ]
  };

  const WORD_ANALYSIS = {
    'οἶνοψ': {
      etymology: 'οἶνος (wine) + ὤψ (appearance, eye)',
      lsj: 'wine-looking, wine-dark, wine-colored; epithet of sea in Homer',
      frequency: { homer: 17, archaic: 23, classical: 8, hellenistic: 12, imperial: 15 },
      semanticDrift: [
        { period: 'Archaic', meaning: 'literal wine-color', confidence: 91, usage: 'Descriptive' },
        { period: 'Classical', meaning: 'poetic sea epithet', confidence: 87, usage: 'Formulaic' },
        { period: 'Hellenistic', meaning: 'literary archaism', confidence: 73, usage: 'Allusive' },
        { period: 'Imperial', meaning: 'mystery/depth metaphor', confidence: 82, usage: 'Symbolic' }
      ],
      embeddings: [
        { word: 'οἶνοψ', x: 50, y: 40, similarity: 1.0, color: '#F59E0B' },
        { word: 'πόντος', x: 65, y: 35, similarity: 0.89, color: '#3B82F6' },
        { word: 'θάλασσα', x: 70, y: 50, similarity: 0.82, color: '#3B82F6' },
        { word: 'μυστήριον', x: 35, y: 60, similarity: 0.78, color: '#7C3AED' },
        { word: 'βάθος', x: 55, y: 65, similarity: 0.74, color: '#DC2626' },
        { word: 'χρῶμα', x: 25, y: 45, similarity: 0.71, color: '#D97706' }
      ]
    },
    'ἀλλοτριόω': {
      etymology: 'ἀλλότριος (foreign, strange) + -όω (denominative suffix)',
      lsj: 'to estrange, alienate; make foreign; transfer ownership',
      frequency: { classical: 45, hellenistic: 67, imperial: 89, late: 134 },
      semanticDrift: [
        { period: 'Classical', meaning: 'legal alienation', confidence: 94, usage: 'Technical' },
        { period: 'Hellenistic', meaning: 'social estrangement', confidence: 88, usage: 'Extended' },
        { period: 'Imperial', meaning: 'philosophical detachment', confidence: 85, usage: 'Abstract' },
        { period: 'Late Antique', meaning: 'spiritual alienation', confidence: 91, usage: 'Theological' }
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
      description: "οἶνοψ πόντος (wine-dark sea) appears 17 times in Homer, but LOGOS found 3 instances in 4th century Christian hymns describing baptismal waters.", 
      criticalApparatus: "Manuscript evidence shows consistent transmission of Homeric formula across Christian adaptations with minimal orthographic variation. The P.Oxy. fragment preserves the earliest attestation.",
      evidence: [
        { 
          text: "Homer Od. 5.349: 'οἶνοπα πόντον ἐπὶ ἰχθυόεντα' - over the wine-dark fishful sea", 
          url: "https://scaife.perseus.tufts.edu/reader/urn:cts:greekLit:tlg0012.tlg002.perseus-grc2:5.349/",
          polytonic: "οἶνοπα πόντον ἐπὶ ἰχθυόεντα",
          analysis: "Accusative singular neuter of compound adjective in traditional dactylic hexameter. Formulaic epithet recurring across Homeric corpus.",
          confidence: 95
        },
        { 
          text: "Ephrem Hymn 3.4: 'βαπτισματικὰ ὕδατα οἰνώδη μυστηρίῳ' - baptismal waters wine-dark with mystery", 
          url: "https://archive.org/details/ephraemhymni",
          polytonic: "βαπτισματικὰ ὕδατα οἰνώδη μυστηρίῳ",
          analysis: "Christian theological adaptation using cognate adjective οἰνώδης instead of Homeric οἶνοψ, suggesting conscious literary allusion.",
          confidence: 90
        }
      ]
    }
  ];

  const getEraColor = (era: string) => {
    switch (era) {
      case "Archaic": return "#D97706";
      case "Classical": return "#F59E0B";
      case "Hellenistic": return "#3B82F6";
      case "Imperial": return "#DC2626";
      case "Late Antique": return "#7C3AED";
      case "Byzantine": return "#059669";
      default: return "#9CA3AF";
    }
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', fontFamily: 'sans-serif', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'background-color 0.3s ease' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#F5F4F2', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
        Logos Discovery Engine
      </h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {DISCOVERY_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              backgroundColor: selectedType === type ? '#C9A227' : '#1E1E24',
              color: '#F5F4F2',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, color 0.3s ease',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <div style={{ width: '90%', maxWidth: '1200px' }}>
        {DISCOVERIES.map(discovery => (
          <div
            key={discovery.id}
            style={{
              backgroundColor: '#1E1E24',
              borderRadius: '10px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)',
              transition: 'background-color 0.3s ease, transform 0.3s ease',
              transform: expandedDiscovery === discovery.id ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#F5F4F2', margin: '0' }}>{discovery.title}</h2>
              <div style={{
                backgroundColor: getEraColor(discovery.era),
                color: '#0D0D0F',
                padding: '5px 10px',
                borderRadius: '5px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {discovery.era}
              </div>
            </div>

            <p style={{ color: '#9CA3AF', fontSize: '1rem', lineHeight: '1.6', marginBottom: '15px' }}>{discovery.description}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Type: {discovery.type}</span>
                <span style={{ color: discovery.language === 'Greek' ? '#3B82F6' : '#DC2626', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {discovery.language} {discovery.language === 'Greek' ? 'Α' : 'L'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Confidence: {discovery.confidence}%</span>
                <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Novelty: {discovery.novelty}%</span>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '10px' }}>Critical Apparatus</h3>
              <p style={{ color: '#9CA3AF', fontSize: '1rem', lineHeight: '1.6' }}>{discovery.criticalApparatus}</p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '10px' }}>Evidence</h3>
              {discovery.evidence.map((evidence, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: selectedEvidence[index] ? '#141419' : '#1E1E24',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                  onClick={() => setSelectedEvidence({ ...selectedEvidence, [index]: !selectedEvidence[index] })}
                >
                  <a href={evidence.url} target="_blank" rel="noopener noreferrer" style={{ color: '#C9A227', textDecoration: 'none', display: 'block', marginBottom: '5px', transition: 'color 0.3s ease' }}>
                    {evidence.text}
                  </a>
                  {selectedEvidence[index] && (
                    <div style={{ marginTop: '10px' }}>
                      <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        Analysis: {evidence.analysis}
                      </p>
                      <p style={{ color: '#6B7280', fontSize: '0.8rem' }}>Confidence: {evidence.confidence}%</p>
                      {evidence.polytonic && (
                        <p style={{ fontFamily: 'serif', fontSize: '1.1rem', color: '#F5F4F2' }}>{evidence.polytonic}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}