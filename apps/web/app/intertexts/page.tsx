'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';

const INTERTEXTS = [
  {
    id: 1,
    source: { 
      ref: 'Aeneid 1.1-4', 
      text: 'Arma virumque cano, Troiae qui primus ab oris / Italiam, fato profugus, Laviniaque venit / litora, multum ille et terris iactatus et alto / vi superum saevae memorem Iunonis ob iram', 
      author: 'Virgil', 
      work: 'Aeneid', 
      language: 'latin',
      era: 'Imperial',
      date: '29-19 BCE'
    },
    target: { 
      ref: 'Iliad 1.1-4', 
      text: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος / οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε, / πολλὰς δ᾽ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν / ἡρώων, αὐτοὺς δὲ ἑλώρια τεῦχε κύνεσσιν', 
      author: 'Homer', 
      work: 'Iliad', 
      language: 'greek',
      era: 'Archaic',
      date: '8th century BCE'
    },
    type: 'Structural Parallelism',
    subtype: 'Prooemial Formula',
    strength: 95,
    description: 'Programmatic opening with traditional epic invocation structure',
    apparatus: {
      mss: ['P¹', 'Mediceus', 'Palatinus'],
      variants: [
        { lemma: 'cano', variants: ['canam (P¹)', 'canere (late MSS)'] },
        { lemma: 'ἄειδε', variants: ['ἄειδ᾽ (schol.)', 'εἰδέ (West)'] }
      ]
    },
    connections: [
      { 
        source: 'Arma virumque', 
        target: 'μῆνιν', 
        type: 'structural', 
        reason: 'Accusative object + theme announcement',
        lsj: 'μῆνις, -ιος: wrath, esp. of gods (Il. 1.1)',
        paradigm: {
          lemma: 'μῆνις',
          forms: [
            { case: 'Nom.', form: 'μῆνις' },
            { case: 'Gen.', form: 'μήνιος' },
            { case: 'Dat.', form: 'μήνιδι' },
            { case: 'Acc.', form: 'μῆνιν' }
          ]
        }
      },
      { 
        source: 'cano', 
        target: 'ἄειδε', 
        type: 'functional', 
        reason: 'Performance imperative - Roman vs Greek tradition',
        lsj: 'ἀείδω: sing, chant (epic/lyric performance verb)',
        paradigm: {
          lemma: 'ἀείδω',
          forms: [
            { tense: 'Present', form: 'ἀείδω' },
            { tense: 'Future', form: 'ᾄσομαι' },
            { tense: 'Aorist', form: 'ᾖσα' },
            { tense: 'Perfect', form: 'ᾖσμαι' }
          ]
        }
      }
    ],
    semanticDrift: [
      { word: 'cano', period: 'Early Latin', meaning: 'prophesy, sing ritually', frequency: 45 },
      { word: 'cano', period: 'Classical', meaning: 'sing, compose poetry', frequency: 78 },
      { word: 'cano', period: 'Imperial', meaning: 'celebrate in verse', frequency: 62 }
    ]
  },
  {
    id: 2,
    source: { 
      ref: 'Aeneid 6.847-853', 
      text: 'tu regere imperio populos, Romane, memento / (hae tibi erunt artes), pacique imponere morem, / parcere subiectis et debellare superbos', 
      author: 'Virgil', 
      work: 'Aeneid', 
      language: 'latin',
      era: 'Imperial',
      date: '29-19 BCE'
    },
    target: { 
      ref: 'Iliad 6.146-149', 
      text: 'οἵη περ φύλλων γενεή, τοίη δὲ καὶ ἀνδρῶν. / φύλλα τὰ μέν τ᾽ ἄνεμος χαμάδις χέει, ἄλλα δέ θ᾽ ὕλη / τηλεθόωσα φύει, ἔαρος δ᾽ ἐπιγίγνεται ὥρη', 
      author: 'Homer', 
      work: 'Iliad', 
      language: 'greek',
      era: 'Archaic',
      date: '8th century BCE'
    },
    type: 'Contrastive Allusion',
    subtype: 'Ideological Inversion',
    strength: 88,
    description: 'Roman imperial ideology vs Greek heroic transience',
    apparatus: {
      mss: ['Mediceus', 'Palatinus', 'Romanus'],
      variants: [
        { lemma: 'regere', variants: ['ducere (R)', 'gerere (late)'] },
        { lemma: 'φύλλων', variants: ['φυλλέων (Zen.)', 'φύλλα (D)'] }
      ]
    },
    connections: [
      { 
        source: 'regere imperio', 
        target: 'φύλλων γενεή', 
        type: 'contrastive', 
        reason: 'Permanence vs transience theme',
        lsj: 'γενεή, -ῆς: race, generation (mortal cycles)',
        paradigm: {
          lemma: 'γενεή',
          forms: [
            { case: 'Nom.', form: 'γενεή' },
            { case: 'Gen.', form: 'γενεῆς' },
            { case: 'Dat.', form: 'γενεῇ' },
            { case: 'Acc.', form: 'γενεήν' }
          ]
        }
      }
    ],
    semanticDrift: [
      { word: 'γενεή', period: 'Archaic', meaning: 'birth, family lineage', frequency: 34 },
      { word: 'γενεή', period: 'Classical', meaning: 'generation, race', frequency: 56 },
      { word: 'γενεή', period: 'Hellenistic', meaning: 'class, type', frequency: 23 }
    ]
  },
  {
    id: 3,
    source: { 
      ref: 'Metamorphoses 1.1-4', 
      text: 'In nova fert animus mutatas dicere formas / corpora; di, coeptis (nam vos mutastis et illas) / adspirate meis primaque ab origine mundi / ad mea perpetuum deducite tempora carmen', 
      author: 'Ovid', 
      work: 'Metamorphoses', 
      language: 'latin',
      era: 'Imperial',
      date: '8 CE'
    },
    target: { 
      ref: 'Theogony 1-8', 
      text: 'Μουσάων Ἑλικωνιάδων ἀρχώμεθ᾽ ἀείδειν, / αἳ θ᾽ Ἑλικῶνος ἔχουσιν ὄρος μέγα τε ζάθεόν τε / καί τε περὶ κρήνην ἰοειδέα πόσσιν ἁβροῖσιν / ὀρχεῦνται καὶ βωμὸν ἐρισφαράγου Διὸς υἱοῦ', 
      author: 'Hesiod', 
      work: 'Theogony', 
      language: 'greek',
      era: 'Archaic',
      date: '7th century BCE'
    },
    type: 'Generic Innovation',
    subtype: 'Metamorphic Poetics',
    strength: 92,
    description: 'Transformation of cosmogonic tradition through metamorphosis',
    apparatus: {
      mss: ['Mediceus', 'Parisinus', 'Marcianus'],
      variants: [
        { lemma: 'formas', variants: ['formam (M)', 'forma (late)'] },
        { lemma: 'ἀρχώμεθ᾽', variants: ['ἀρχόμεθα (Proc.)', 'ἄρχεσθε (schol.)'] }
      ]
    },
    connections: [
      { 
        source: 'mutatas formas', 
        target: 'ἀρχώμεθ᾽ ἀείδειν', 
        type: 'innovative', 
        reason: 'Metamorphic principle applied to traditional invocation',
        lsj: 'ἄρχω: begin, rule (mid. begin for oneself)',
        paradigm: {
          lemma: 'ἄρχω',
          forms: [
            { voice: 'Act. Pres.', form: 'ἄρχω' },
            { voice: 'Mid. Pres.', form: 'ἄρχομαι' },
            { voice: 'Act. Fut.', form: 'ἄρξω' },
            { voice: 'Mid. Fut.', form: 'ἄρξομαι' }
          ]
        }
      }
    ],
    semanticDrift: [
      { word: 'forma', period: 'Early Latin', meaning: 'shape, mold', frequency: 28 },
      { word: 'forma', period: 'Classical', meaning: 'form, beauty', frequency: 65 },
      { word: 'forma', period: 'Imperial', meaning: 'literary form', frequency: 41 }
    ]
  }
];

const ERA_COLORS = {
  'Archaic': '#D97706',
  'Classical': '#F59E0B',
  'Hellenistic': '#3B82F6',
  'Imperial': '#DC2626',
  'Late Antique': '#7C3AED',
  'Byzantine': '#059669'
};

const CONNECTION_COLORS = {
  'structural': '#3B82F6',
  'functional': '#10B981',
  'contrastive': '#F59E0B',
  'innovative': '#8B5CF6'
};

export default function IntertextsPage() {
  const [selectedIntertext, setSelectedIntertext] = useState(INTERTEXTS[0]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [showApparatus, setShowApparatus] = useState(false);
  const [showParadigm, setShowParadigm] = useState(null);
  const [showSemanticDrift, setShowSemanticDrift] = useState(false);
  const [filterStrength, setFilterStrength] = useState(0);
  const [selectedView, setSelectedView] = useState('connections');

  const filteredIntertexts = useMemo(() => {
    return INTERTEXTS.filter(intertext => intertext.strength >= filterStrength);
  }, [filterStrength]);

  const renderHighlightedText = (text, connections, language, isSource = true) => {
    if (!connections) return text;
    
    let highlightedText = text;
    connections.forEach((conn, index) => {
      const searchTerm = isSource ? conn.source : conn.target;
      if (searchTerm && highlightedText.includes(searchTerm)) {
        const color = CONNECTION_COLORS[conn.type] || '#C9A227';
        highlightedText = highlightedText.replace(
          searchTerm,
          `<span style="background-color: ${color}33; color: ${color}; padding: 2px 4px; border-radius: 3px; cursor: pointer;" 
           data-connection="${index}">${searchTerm}</span>`
        );
      }
    });
    
    return <div 
      style={{ 
        fontFamily: language === 'greek' ? 'serif' : 'serif',
        fontSize: '16px',
        lineHeight: '1.6'
      }}
      dangerouslySetInnerHTML={{ __html: highlightedText }}
      onClick={(e) => {
        const connectionIndex = e.target.getAttribute('data-connection');
        if (connectionIndex !== null) {
          setActiveConnection(connections[parseInt(connectionIndex)]);
        }
      }}
    />;
  };

  const renderSemanticDriftVisualization = (driftData) => {
    if (!driftData || driftData.length === 0) return null;

    const maxFreq = Math.max(...driftData.map(d => d.frequency));
    
    return (
      <div style={{ margin: '20px 0' }}>
        <h4 style={{ color: '#F5F4F2', marginBottom: '15px', fontSize: '14px' }}>
          Semantic Evolution
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {driftData.map((drift, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '80px',
                fontSize: '12px',
                color: '#9CA3AF',
                fontWeight: '500'
              }}>
                {drift.period}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  width: `${(drift.frequency / maxFreq) * 200}px`,
                  height: '20px',
                  backgroundColor: '#C9A227',
                  borderRadius: '10px',
                  position: 'relative',
                  opacity: 0.7
                }}>
                  <div style={{
                    position: 'absolute',
                    right: '8px',
                    top: '2px',
                    fontSize: '10px',
                    color: '#0D0D0F',
                    fontWeight: 'bold'
                  }}>
                    {drift.frequency}
                  </div>
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#F5F4F2',
                  marginTop: '4px'
                }}>
                  {drift.meaning}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderParadigmTable = (paradigm) => {
    if (!paradigm || !paradigm.forms) return null;

    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#1E1E24',
        border: '2px solid #C9A227',
        borderRadius: '8px',
        padding: '20px',
        zIndex: 1000,
        minWidth: '300px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ color: '#C9A227', margin: 0, fontSize: '18px' }}>
            {paradigm.lemma}
          </h3>
          <button
            onClick={() => setShowParadigm(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '0',
              width: '24px',
              height: '24px'
            }}
          >
            ×
          </button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px'
        }}>
          {paradigm.forms.map((form, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 10px',
              backgroundColor: '#141419',
              borderRadius: '4px'
            }}>
              <span style={{ color: '#9CA3AF', fontSize: '12px' }}>
                {form.case || form.tense || form.voice}
              </span>
              <span style={{ color: '#F5F4F2', fontSize: '14px', fontFamily: 'serif' }}>
                {form.form}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      backgroundColor: '#0D0D0F', 
      minHeight: '100vh',
      color: '#F5F4F2',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <Link 
            href="/"
            style={{ 
              color: '#C9A227', 
              textDecoration: 'none',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            ← Back to Home
          </Link>
          <h1 style={{ 
            color: '#C9A227', 
            fontSize: '32px', 
            margin: 0,
            fontWeight: '600'
          }}>
            Intertextual Analysis
          </h1>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ color: '#9CA3AF', fontSize: '14px' }}>
              Min Strength:
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={filterStrength}
              onChange={(e) => setFilterStrength(parseInt(e.target.value))}
              style={{
                width: '120px',
                height: '4px',
                borderRadius: '2px',
                background: `linear-gradient(to right, #C9A227 0%, #C9A227 ${filterStrength}%, #6B7280 ${filterStrength}%, #6B7280 100%)`,
                outline: 'none',
                appearance: 'none'
              }}
            />
            <span style={{ color: '#F5F4F2', fontSize: '14px', minWidth: '30px' }}>
              {filterStrength}%
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {['connections', 'apparatus', 'drift'].map(view => (
              <button
                key={view}
                onClick={() => {
                  setSelectedView(view);
                  if (view === 'apparatus') setShowApparatus(true);
                  if (view === 'drift') setShowSemanticDrift(true);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: selectedView === view ? '#C9A227' : '#1E1E24',
                  color: selectedView === view ? '#0D0D0F' : '#F5F4F2',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize'
                }}
              >
                {view === 'drift' ? 'Semantic Drift' : view}
              </button>
            ))}
          </div>
        </div>

        {/* Intertext Selector */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          overflowX: 'auto',
          paddingBottom: '10px'
        }}>
          {filteredIntertexts.map(intertext => (
            <button
              key={intertext.id}
              onClick={() => setSelectedIntertext(intertext)}
              style={{
                padding: '12px 20px',
                backgroundColor: selectedIntertext.id === intertext.id ? '#C9A227' : '#1E1E24',
                color: selectedIntertext.id === intertext.id ? '#0D0D0F' : '#F5F4F2',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                minWidth: '200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '4px'
              }}
            >
              <div style={{ fontWeight: '600' }}>
                {intertext.source.author} → {intertext.target.author}
              </div>
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.8,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>{intertext.type}</span>
                <span style={{
                  backgroundColor: selectedIntertext.id === intertext.id ? '#0D0D0F' : '#C9A227',
                  color: selectedIntertext.id === intertext.id ? '#C9A227' : '#0D0D0F',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {intertext.strength}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '30px'
      }}>
        {/* Side-by-Side Texts */}
        <div style={{
          backgroundColor: '#1E1E24',
          borderRadius: '12px',
          padding: '25px',
          border: '1px solid #6B7280'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            height: 'fit-content'
          }}>
            {/* Source Text */}
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                marginBottom: '15px' 
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: selectedIntertext.source.language === 'latin' ? '#DC2626' : '#3B82F6',
                  color: '#F5F4F2',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedIntertext.source.language === 'latin' ? 'L' : 'Α'}
                </div>
                <h3 style={{ color: '#C9A227', margin: 0, fontSize: '18px' }}>
                  {selectedIntertext.source.ref}
                </h3>
                <div style={{
                  backgroundColor: ERA_COLORS[selectedIntertext.source.era],
                  color: '#0D0D0F',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {selectedIntertext.source.era}
                </div>
              </div>
              <div style={{ 
                color: '#9CA3AF', 
                fontSize: '14px', 
                marginBottom: '15px' 
              }}>
                {selectedIntertext.source.author}, <em>{selectedIntertext.source.work}</em> ({selectedIntertext.source.date})
              </div>
              <div style={{ 
                padding: '20px',
                backgroundColor: '#141419',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                {renderHighlightedText(
                  selectedIntertext.source.text, 
                  selectedIntertext.connections, 
                  selectedIntertext.source.language, 
                  true
                )}
              </div>
            </div>

            {/* Target Text */}
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                marginBottom: '15px' 
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: selectedIntertext.target.language === 'latin' ? '#DC2626' : '#3B82F6',
                  color: '#F5F4F2',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedIntertext.target.language === 'latin' ? 'L' : 'Α'}
                </div>
                <h3 style={{ color: '#C9A227', margin: 0, fontSize: '18px' }}>
                  {selectedIntertext.target.ref}
                </h3>
                <div style={{
                  backgroundColor: ERA_COLORS[selectedIntertext.target.era],
                  color: '#0D0D0F',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {selectedIntertext.target.era}
                </div>
              </div>
              <div style={{ 
                color: '#9CA3AF', 
                fontSize: '14px', 
                marginBottom: '15px' 
              }}>
                {selectedIntertext.target.author}, <em>{selectedIntertext.target.work}</em> ({selectedIntertext.target.date})
              </div>
              <div style={{ 
                padding: '20px',
                backgroundColor: '#141419',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                {renderHighlightedText(
                  selectedIntertext.target.text, 
                  selectedIntertext.connections, 
                  selectedIntertext.target.language, 
                  false
                )}
              </div>
            </div>
          </div>

          {/* Intertextual Analysis */}
          <div style={{
            marginTop: '25px',
            padding: '20px',
            backgroundColor: '#141419',
            borderRadius: '8px',
            border: `1px solid ${CONNECTION_COLORS[selectedIntertext.connections?.[0]?.type] || '#C9A227'}`
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
              marginBottom: '15px' 
            }}>
              <div>
                <h4 style={{ color: '#C9A227', margin: '0 0 5px 0', fontSize: '16px' }}>
                  {selectedIntertext.type}: {selectedIntertext.subtype}
                </h4>
                <div style={{ color: '#9CA3AF', fontSize: '14px' }}>
                  {selectedIntertext.description}
                </div>
              </div>
              <div style={{
                backgroundColor: '#C9A227',
                color: '#0D0D0F',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {selectedIntertext.strength}% strength
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Panel */}
        <div style={{
          backgroundColor: '#1E1E24',
          borderRadius: '12px',
          padding: '25px',
          border: '1px solid #6B7280',
          height: 'fit-content'
        }}>
          {/* Connections */}
          {selectedView === 'connections' && (
            <div>
              <h3 style={{ color: '#C9A227', marginBottom: '20px', fontSize: '18px' }}>
                Textual Connections
              