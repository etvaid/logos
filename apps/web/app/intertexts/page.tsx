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

const IntertextualityExplorer = () => {
  const [selectedIntertext, setSelectedIntertext] = useState(null);
  const [activeTab, setActiveTab] = useState('connections');
  const [hoveredConnection, setHoveredConnection] = useState(null);

  const InteractionCard = ({ intertext }) => (
    <div 
      style={{
        background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
        border: '2px solid',
        borderImage: 'linear-gradient(45deg, #C9A227, #9CA3AF) 1',
        borderRadius: '16px',
        padding: '24px',
        cursor: 'pointer',
        transform: selectedIntertext?.id === intertext.id ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: selectedIntertext?.id === intertext.id 
          ? '0 20px 40px rgba(201, 162, 39, 0.3), 0 0 80px rgba(201, 162, 39, 0.1)' 
          : '0 8px 32px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => setSelectedIntertext(intertext)}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${ERA_COLORS[intertext.source.era]}, ${ERA_COLORS[intertext.target.era]})`,
        transition: 'width 0.3s ease-in-out',
      }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ color: '#F5F4F2', margin: '0', fontSize: '1.2em' }}>
            {intertext.type}
          </h3>
          <span style={{ color: '#9CA3AF', fontSize: '0.8em' }}>Strength: {intertext.strength}%</span>
        </div>

        <p style={{ color: '#9CA3AF', margin: '0', fontSize: '0.9em' }}>
          {intertext.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ color: '#6B7280', fontSize: '0.75em' }}>Source: {intertext.source.work}</span>
            <span style={{ color: '#6B7280', fontSize: '0.75em' }}>Target: {intertext.target.work}</span>
          </div>
          <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${ERA_COLORS[intertext.source.era]}, ${ERA_COLORS[intertext.target.era]})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F5F4F2',
              fontWeight: 'bold'
          }}>
              {intertext.source.language[0].toUpperCase()}{intertext.target.language[0].toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );

  const ConnectionVisualization = ({ intertext }) => {
    if (!intertext) return null;

    const { connections } = intertext;

    return (
      <div style={{ position: 'relative', width: '100%', height: '300px', overflow: 'hidden' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          {connections.map((connection, index) => {
            const isHovered = hoveredConnection === connection;
            const strokeWidth = isHovered ? 4 : 2;
            const strokeColor = isHovered ? '#C9A227' : '#9CA3AF';

            return (
              <line
                key={index}
                x1={`${(index + 1) * (100 / (connections.length + 1))}%`}
                y1="20%"
                x2={`${(index + 1) * (100 / (connections.length + 1))}%`}
                y2="80%"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                style={{ transition: 'all 0.2s ease-in-out' }}
                onMouseEnter={() => setHoveredConnection(connection)}
                onMouseLeave={() => setHoveredConnection(null)}
              />
            );
          })}

          {connections.map((connection, index) => (
            <React.Fragment key={`source-${index}`}>
              <circle
                cx={`${(index + 1) * (100 / (connections.length + 1))}%`}
                cy="20%"
                r="8"
                fill={ERA_COLORS[selectedIntertext.source.era]}
                stroke="#0D0D0F"
                strokeWidth="2"
                style={{ transition: 'all 0.2s ease-in-out' }}
              />
              <text
                x={`${(index + 1) * (100 / (connections.length + 1))}%`}
                y="15%"
                textAnchor="middle"
                fontSize="0.7em"
                fill="#F5F4F2"
                style={{ pointerEvents: 'none' }}
              >
                Source
              </text>
            </React.Fragment>
          ))}

          {connections.map((connection, index) => (
            <React.Fragment key={`target-${index}`}>
              <circle
                cx={`${(index + 1) * (100 / (connections.length + 1))}%`}
                cy="80%"
                r="8"
                fill={ERA_COLORS[selectedIntertext.target.era]}
                stroke="#0D0D0F"
                strokeWidth="2"
                style={{ transition: 'all 0.2s ease-in-out' }}
              />
              <text
                x={`${(index + 1) * (100 / (connections.length + 1))}%`}
                y="85%"
                textAnchor="middle"
                fontSize="0.7em"
                fill="#F5F4F2"
                style={{ pointerEvents: 'none' }}
              >
                Target
              </text>
            </React.Fragment>
          ))}
        </svg>
      </div>
    );
  };
  
  const SemanticDriftChart = ({ semanticDrift }) => {
    if (!semanticDrift) return null;

    const maxFrequency = Math.max(...semanticDrift.map(item => item.frequency));

    return (
      <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          {semanticDrift.map((item, index) => {
            const barHeight = (item.frequency / maxFrequency) * 80; // Scale to 80% of the chart height
            const x = `${(index + 0.5) * (100 / semanticDrift.length)}%`; // Center the bar
            const y = `${100 - barHeight}%`;
            const width = `${(0.8 * (100 / semanticDrift.length))}%`; // Make bars thinner for spacing
            const eraColor = ERA_COLORS[item.period.split(' ')[0]]; // Get era color

            return (
              <React.Fragment key={index}>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={`${barHeight}%`}
                  fill={eraColor}
                  transform={`translate(-${parseFloat(width) / 2}, 0)`} // Center the bar
                />
                <text
                  x={x}
                  y="95%"
                  textAnchor="middle"
                  fontSize="0.7em"
                  fill="#F5F4F2"
                >
                  {item.period}
                </text>
              </React.Fragment>
            );
          })}
        </svg>
      </div>
    );
  };


  const IntertextDetails = ({ intertext }) => {
    if (!intertext) return null;

    return (
      <div style={{
        background: '#1E1E24',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' }}>
          <h2 style={{ color: '#F5F4F2', margin: '0', fontSize: '1.5em' }}>{intertext.type}</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{
                background: activeTab === 'connections' ? '#C9A227' : '#333',
                color: '#F5F4F2',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onClick={() => setActiveTab('connections')}
            >
              Connections
            </button>
            <button
              style={{
                background: activeTab === 'apparatus' ? '#C9A227' : '#333',
                color: '#F5F4F2',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onClick={() => setActiveTab('apparatus')}
            >
              Apparatus
            </button>
            <button
              style={{
                background: activeTab === 'semanticDrift' ? '#C9A227' : '#333',
                color: '#F5F4F2',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onClick={() => setActiveTab('semanticDrift')}
            >
              Semantic Drift
            </button>
          </div>
        </div>

        {activeTab === 'connections' && (
          <>
          <ConnectionVisualization intertext={intertext} />
            {intertext.connections.map((connection, index) => (
              <div key={index} style={{ padding: '16px', border: '1px solid #333', borderRadius: '8px', transition: 'background-color 0.2s ease', backgroundColor: hoveredConnection === connection ? '#333' : 'transparent' }}
              onMouseEnter={() => setHoveredConnection(connection)}
              onMouseLeave={() => setHoveredConnection(null)}>
                <h4 style={{ color: '#F5F4F2' }}>{connection.type}</h4>
                <p style={{ color: '#9CA3AF' }}>Reason: {connection.reason}</p>
                <p style={{ color: '#9CA3AF' }}>LSJ: {connection.lsj}</p>
                <h5 style={{ color: '#F5F4F2' }}>Paradigm: {connection.paradigm.lemma}</h5>
                <ul style={{ color: '#9CA3AF', paddingLeft: '20px' }}>
                  {connection.paradigm.forms.map((form, i) => (
                    <li key={i}>{form.case ? `${form.case}: ` : `${form.tense}: `}{form.form}</li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}

        {activeTab === 'apparatus' && (
          <div>
            <h3 style={{ color: '#F5F4F2' }}>Manuscripts</h3>
            <p style={{ color: '#9CA3AF' }}>{intertext.apparatus.mss.join(', ')}</p>
            <h3 style={{ color: '#F5F4F2' }}>Variants</h3>
            {intertext.apparatus.variants.map((variant, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <span style={{ color: '#F5F4F2' }}>Lemma: {variant.lemma}</span>
                <ul style={{ color: '#9CA3AF', paddingLeft: '20px' }}>
                  {variant.variants.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'semanticDrift' && (
          <>
            <SemanticDriftChart semanticDrift={intertext.semanticDrift} />
            <div>
              <h3 style={{ color: '#F5F4F2' }}>Semantic Drift</h3>
              {intertext.semanticDrift.map((drift, index) => (
                <div key={index} style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#F5F4F2' }}>Word: {drift.word}</span>
                  <p style={{ color: '#9CA3AF' }}>Period: {drift.period}</p>
                  <p style={{ color: '#9CA3AF' }}>Meaning: {drift.meaning}</p>
                  <p style={{ color: '#9CA3AF' }}>Frequency: {drift.frequency}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2', 
      fontFamily: 'sans-serif', 
      minHeight: '100vh', 
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#C9A227', fontSize: '2.5em', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Logos Intertextuality Explorer</h1>
        <p style={{ color: '#9CA3AF', fontSize: '1.2em' }}>Discover connections between ancient texts</p>
      </header>

      <main style={{ display: 'flex', width: '90%', maxWidth: '1200px' }}>
        <div style={{ flex: '1', marginRight: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {INTERTEXTS.map(intertext => (
            <InteractionCard key={intertext.id} intertext={intertext} />
          ))}
        </div>
        <div style={{ flex: '2' }}>
          <IntertextDetails intertext={selectedIntertext} />
        </div>
      </main>

      <footer style={{ marginTop: '20px', textAlign: 'center', color: '#6B7280' }}>
        <p>&copy; 2024 Logos Project</p>
      </footer>
    </div>
  );
};

export default IntertextualityExplorer;