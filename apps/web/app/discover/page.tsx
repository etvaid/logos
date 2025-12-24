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
          confidence: 88
        },
        { 
          text: "Clement Hymn 2.1: 'κατάβασις εἰς οἰνόχρους βάθη σωτηρίας' - descent into wine-colored depths of salvation", 
          url: "https://www.newadvent.org/fathers/02093.htm",
          polytonic: "κατάβασις εἰς οἰνόχρους βάθη σωτηρίας",
          analysis: "Compound adjective οἰνόχρους (wine-colored) represents semantic expansion of Homeric formula into soteriological context.",
          confidence: 83
        }
      ],
      fullDetails: {
        methodology: "Semantic vector analysis across 847,000 Greek texts revealed unexpected clustering using Word2Vec embeddings trained on 50M tokens with contextual dependency parsing and manuscript collation.",
        statistics: "P-value: 0.0003, Effect size: 2.1σ, Corpus coverage: 94%, FDR: <0.01, Cosine similarity: 0.847, Inter-annotator agreement: κ=0.89",
        implications: "Systematic adoption of Homeric imagery in early Christian ritual language suggests sophisticated literary education among 4th-century hymn writers and deliberate appropriation of classical authority for theological innovation."
      }
    },
    { 
      id: 2, 
      title: "Stoic Alienation Terminology in Paul", 
      type: "Influence", 
      language: "Greek",
      confidence: 91, 
      novelty: 88,
      era: "Imperial",
      description: "Statistical analysis reveals Paul's use of ἀλλοτριόω follows Stoic philosophical patterns rather than LXX usage, suggesting direct engagement with contemporary philosophy.", 
      criticalApparatus: "Papyrological evidence from P.Berol. 13270 confirms early textual stability. Byzantine manuscripts show systematic theological glossing.",
      evidence: [
        { 
          text: "Ephesians 4:18: 'ἀπηλλοτριωμένοι τῆς ζωῆς τοῦ θεοῦ' - alienated from the life of God", 
          url: "https://www.blueletterbible.org/kjv/eph/4/18/",
          polytonic: "ἀπηλλοτριωμένοι τῆς ζωῆς τοῦ θεοῦ",
          analysis: "Perfect passive participle indicating completed state of alienation, following Stoic technical usage of ἀλλοτριόω for metaphysical separation.",
          confidence: 92
        },
        { 
          text: "Epictetus Disc. 1.9.7: 'ἀλλοτριωθῆναι τῶν κατὰ φύσιν' - to be alienated from natural things", 
          url: "http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0236",
          polytonic: "ἀλλοτριωθῆναι τῶν κατὰ φύσιν",
          analysis: "Aorist passive infinitive expressing philosophical concept of estrangement from natural order. Direct parallel to Pauline theological usage.",
          confidence: 89
        }
      ],
      fullDetails: {
        methodology: "Collocation analysis using mutual information scores across 2.3M Greek philosophical and religious texts with syntactic parsing and dependency relations.",
        statistics: "MI score: 4.2, Log-likelihood: 847.3, P-value: <0.0001, Precision: 0.91, Recall: 0.87, F1: 0.89",
        implications: "Paul's sophisticated use of Stoic terminology suggests systematic engagement with contemporary philosophy, not mere linguistic borrowing."
      }
    },
    { 
      id: 3, 
      title: "Virgilian Intertextuality in Prudentius", 
      type: "Intertextuality", 
      language: "Latin",
      confidence: 89, 
      novelty: 85,
      era: "Late Antique",
      description: "LOGOS detected systematic adaptation of Virgilian formulae in Prudentius' Psychomachia, with 23 direct parallels showing Christian recontextualization of epic language.", 
      criticalApparatus: "Critical edition comparison across 12 manuscript families reveals stable transmission with minimal scribal intervention in classical allusions.",
      evidence: [
        { 
          text: "Virgil Aeneid 6.126: 'Troius Aeneas pietate insignis' - Trojan Aeneas renowned for piety", 
          url: "https://scaife.perseus.tufts.edu/reader/urn:cts:latinLit:phi0690.phi003.perseus-lat2:6.126/",
          polytonic: "Troius Aeneas pietate insignis",
          analysis: "Ablative of specification with epithetic adjective. Classical formula for heroic virtue establishing moral paradigm.",
          confidence: 94
        },
        { 
          text: "Prudentius Psych. 123: 'Christicola miles pietate insignis' - Christian soldier renowned for piety", 
          url: "https://archive.org/details/prudentiusaurel00prud",
          polytonic: "Christicola miles pietate insignis",
          analysis: "Direct adaptation of Virgilian formula with Christian substitution. Maintains metrical pattern while transforming semantic field.",
          confidence: 91
        }
      ],
      fullDetails: {
        methodology: "N-gram analysis with edit distance calculations across Latin epic corpus, combined with metrical analysis and allusion detection algorithms.",
        statistics: "Edit distance: 1.2, Sequence alignment score: 0.94, Metrical congruence: 98%, Semantic similarity: 0.76",
        implications: "Prudentius demonstrates sophisticated literary technique in adapting pagan epic for Christian allegory while preserving classical aesthetic values."
      }
    },
    { 
      id: 4, 
      title: "Semantic Bleaching in Greek Modal Particles", 
      type: "Semantic", 
      language: "Greek",
      confidence: 83, 
      novelty: 91,
      era: "Byzantine",
      description: "Diachronic analysis shows systematic semantic bleaching of modal particles ἄν, κέ from Classical to Byzantine Greek, with functional shift from irrealis to simple emphasis.", 
      evidence: [
        { 
          text: "Homer Il. 1.60: 'εἰ δέ κε μὴ δώῃσι' - but if he should not give", 
          polytonic: "εἰ δέ κε μὴ δώῃσι",
          analysis: "Particle κε marks potential optative in prototypical conditional construction. Full modal force preserved.",
          confidence: 96
        },
        { 
          text: "Procopius Bell. 1.2.3: 'εἰ δέ κε βασιλεύς' - and if the emperor (simply)", 
          polytonic: "εἰ δέ κε βασιλεύς",
          analysis: "Particle κε appears with indicative verb, showing loss of modal force. Purely emphatic function in Byzantine usage.",
          confidence: 84
        }
      ]
    },
    { 
      id: 5, 
      title: "Hyperbaton Patterns in Tacitean Style", 
      type: "Syntax", 
      language: "Latin",
      confidence: 94, 
      novelty: 78,
      era: "Imperial",
      description: "Statistical analysis of word order variations reveals Tacitus employs systematic hyperbaton with 73% higher frequency than contemporary historians, creating distinctive stylistic signature.", 
      evidence: [
        { 
          text: "Tacitus Ann. 1.1: 'Urbem Romam a principio reges habuere' - The city Rome from the beginning kings held", 
          polytonic: "Urbem Romam a principio reges habuere",
          analysis: "Direct object fronted with attributive adjective separated from noun. Creates emphatic focus on 'Rome' while maintaining grammatical clarity.",
          confidence: 97
        }
      ]
    },
    { 
      id: 6, 
      title: "Paleographic Dating Revision", 
      type: "Manuscript", 
      language: "Greek",
      confidence: 76, 
      novelty: 95,
      era: "Byzantine",
      description: "Machine learning analysis of letter forms in P.Oxy. 4301 suggests 7th century date rather than traditional 9th century assignment, based on sigma and alpha morphology.", 
      evidence: [
        { 
          text: "P.Oxy. 4301 line 12: 'σωτηρίας ἀξίως' - worthily of salvation", 
          polytonic: "σωτηρίας ἀξίως",
          analysis: "Sigma forms show consistent lunate shape without cursive elements typical of 9th century hands. Alpha retains straight crossbar characteristic of earlier period.",
          confidence: 76
        }
      ]
    }
  ];

  const filteredDiscoveries = selectedType === 'All' ? DISCOVERIES : DISCOVERIES.filter(d => d.type === selectedType);

  const getEraColor = (era) => {
    const colors = {
      'Archaic': '#D97706',
      'Classical': '#F59E0B',
      'Hellenistic': '#3B82F6',
      'Imperial': '#DC2626',
      'Late Antique': '#7C3AED',
      'Byzantine': '#059669'
    };
    return colors[era] || '#6B7280';
  };

  const renderWordEmbeddings = (word) => {
    const analysis = WORD_ANALYSIS[word];
    if (!analysis?.embeddings) return null;

    return (
      <div style={{ backgroundColor: '#141419', borderRadius: '8px', padding: '16px', marginTop: '16px' }}>
        <h4 style={{ color: '#F5F4F2', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
          Word Embeddings Visualization
        </h4>
        <svg width="300" height="200" style={{ backgroundColor: '#0D0D0F', borderRadius: '4px' }}>
          {analysis.embeddings.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x * 3}
                cy={point.y * 2}
                r={point.similarity * 6}
                fill={point.color}
                opacity={0.7}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredWord(point.word)}
                onMouseLeave={() => setHoveredWord(null)}
              />
              <text
                x={point.x * 3}
                y={point.y * 2 + 20}
                fill="#F5F4F2"
                fontSize="10"
                textAnchor="middle"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {point.word}
              </text>
              {hoveredWord === point.word && (
                <text
                  x={point.x * 3}
                  y={point.y * 2 - 10}
                  fill="#C9A227"
                  fontSize="9"
                  textAnchor="middle"
                >
                  {point.similarity.toFixed(2)}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const renderSemanticDrift = (word) => {
    const analysis = WORD_ANALYSIS[word];
    if (!analysis?.semanticDrift) return null;

    return (
      <div style={{ backgroundColor: '#141419', borderRadius: '8px', padding: '16px', marginTop: '16px' }}>
        <h4 style={{ color: '#F5F4F2', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
          Semantic Drift Analysis
        </h4>
        {analysis.semanticDrift.map((period, i) => (
          <div key={i} style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#1E1E24', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ color: getEraColor(period.period), fontWeight: '600', fontSize: '12px' }}>
                {period.period}
              </span>
              <span style={{ color: '#9CA3AF', fontSize: '11px' }}>
                Confidence: {period.confidence}%
              </span>
            </div>
            <div style={{ color: '#F5F4F2', fontSize: '12px', marginBottom: '2px' }}>
              {period.meaning}
            </div>
            <div style={{ color: '#6B7280', fontSize: '11px', fontStyle: 'italic' }}>
              Usage: {period.usage}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderParadigmTable = (word) => {
    const paradigm = PARADIGM_TABLES[word];
    if (!paradigm) return null;

    return (
      <div style={{ backgroundColor: '#141419', borderRadius: '8px', padding: '16px', marginTop: '16px' }}>
        <h4 style={{ color: '#F5F4F2', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
          {paradigm.type}
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #6B7280' }}>
                <th style={{ color: '#C9A227', fontSize: '11px', padding: '6px', textAlign: 'left' }}>Case</th>
                {paradigm.forms[0].masc && <th style={{ color: '#C9A227', fontSize: '11px', padding: '6px', textAlign: 'left' }}>Masc.</th>}
                {paradigm.forms[0].fem && <th style={{ color: '#C9A227', fontSize: '11px', padding: '6px', textAlign: 'left' }}>Fem.</th>}
                {paradigm.forms[0].neut && <th style={{ color: '#C9A227', fontSize: '11px', padding: '6px', textAlign: 'left' }}>Neut.</th>}
                {paradigm.forms[0].first && <th style={{ color: '#C9A227', fontSize: '11px', padding: '6px', textAlign: 'left' }}>1st</th>}
                {paradigm.forms[0].second && <th style={{ color: '#C9A227', fontSize: '11px', padding: '6px', textAlign: 'left' }}>2nd</th>}
                {paradigm.forms[0].third && <th style={{ color: '#C9A227', fontSize: '11px', padding: '6px', textAlign: 'left' }}>3rd</th>}
              </tr>
            </thead>
            <tbody>
              {paradigm.forms.map((form, i) => (
                <tr key={i}>
                  <td style={{ color: '#9CA3AF', fontSize: '11px', padding: '4px', fontWeight: '600' }}>
                    {form.case || form.tense}
                  </td>
                  {form.masc && <td style={{ color: '#F5F4F2', fontSize: '11px', padding: '4px', fontFamily: 'Georgia, serif' }}>{form.masc}</td>}
                  {form.fem && <td style={{ color: '#F5F4F2', fontSize: '11px', padding: '4px', fontFamily: 'Georgia, serif' }}>{form.fem}</td>}
                  {form.neut && <td style={{ color: '#F5F4F2', fontSize: '11px', padding: '4px', fontFamily: 'Georgia, serif' }}>{form.neut}</td>}
                  {form.first && <td style={{ color: '#F5F4F2', fontSize: '11px', padding: '4px', fontFamily: 'Georgia, serif' }}>{form.first}</td>}
                  {form.second && <td style={{ color: '#F5F4F2', fontSize: '11px', padding: '4px', fontFamily: 'Georgia, serif' }}>{form.second}</td>}
                  {form.third && <td style={{ color: '#F5F4F2', fontSize: '11px', padding: '4px', fontFamily: 'Georgia, serif' }}>{form.third}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderManuscriptVariants = (discoveryId) => {
    const variants = MANUSCRIPT_VARIANTS[discoveryId];
    if (!variants) return null;

    return (
      <div style={{ backgroundColor: '#141419', borderRadius: '8px', padding: '16px', marginTop: '16px' }}>
        <h4 style={{ color: '#F5F4F2', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
          Critical Apparatus
        </h4>
        {variants.map((variant, i) => (
          <div 
            key={i} 
            style={{ 
              marginBottom: '8px', 
              padding: '8px', 
              backgroundColor: activeManuscript === `${discoveryId}-${i}` ? '#1E1E24' : '#0D0D0F', 
              borderRadius: '4px',
              border: `1px solid ${activeManuscript === `${discoveryId}-${i}` ? '#C9A227' : 'transparent'}`,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={() => setActiveManuscript(activeManuscript === `${discoveryId}-${i}` ? null : `${discoveryId}-${i}`)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ color: '#C9A227', fontWeight: '600', fontSize: '12px' }}>
                {variant.ms}
              </span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ color: '#9CA3AF', fontSize: '11px' }}>
                  {variant.date}
                </span>
                <div style={{
                  width: '40px',
                  height: '4px',
                  backgroundColor: '#1E1E24',
                  borderRadius: '2px',
                  position: 'relative'
                }}>
                  <div style={{
                    width: `${variant.confidence}%`,
                    height: '100%',
                    backgroundColor: variant.confidence > 90 ? '#059669' : variant.confidence > 80 ? '#F59E0B' : '#DC2626',
                    borderRadius: '2px'
                  }}></div>
                </div>
                <span style={{ color: '#9CA3AF', fontSize: '10px' }}>
                  {variant.confidence}%
                </span>
              </div>
            </div>
            <div style={{ color: '#F5F4F2', fontSize: '13px', fontFamily: 'Georgia, serif', marginBottom: '4px' }}>
              {variant.reading}
            </div>
            {variant.hand && (
              <div style={{ color: '#6B7280', fontSize: '10px', fontStyle: 'italic' }}>
                {variant.hand}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const extractWords = (text) => {
    return text.split(' ').map((word, i) => {
      const cleanWord = word.replace(/[.,;:·]/g, '');
      const hasAnalysis = WORD_ANALYSIS[cleanWord];
      
      return (
        <span
          key={i}
          style={{
            color: hasAnalysis ? '#C9A227' : '#F5F4F2',