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
            { case: 'Nom.', form: 'ἄρχων' },
            { case: 'Gen.', form: 'ἄρχοντος' },
            { case: 'Dat.', form: 'ἄρχοντι' },
            { case: 'Acc.', form: 'ἄρχοντα' }
          ]
        }
      }
    ],
    semanticDrift: [
      { word: 'formas', period: 'Early Latin', meaning: 'shape, figure', frequency: 67 },
      { word: 'formas', period: 'Classical', meaning: 'beauty, appearance', frequency: 82 },
      { word: 'formas', period: 'Imperial', meaning: 'form, type', frequency: 75 }
    ]
  }
];

const eraColors = {
  'Archaic': '#D97706',
  'Classical': '#F59E0B',
  'Hellenistic': '#3B82F6',
  'Imperial': '#DC2626',
  'Late Antique': '#7C3AED',
  'Byzantine': '#059669'
};

const LanguageIndicator = ({ language }) => {
  let color = '';
  let label = '';

  if (language === 'greek') {
    color = '#3B82F6';
    label = 'Α';
  } else if (language === 'latin') {
    color = '#DC2626';
    label = 'L';
  } else {
    return null;
  }

  return (
    <span
      style={{
        display: 'inline-block',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor: color,
        color: '#F5F4F2',
        fontSize: '10px',
        textAlign: 'center',
        lineHeight: '16px',
        marginLeft: '5px',
        verticalAlign: 'middle',
      }}
    >
      {label}
    </span>
  );
};


const IntertextCard = ({ intertext }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sourceEraColor = eraColors[intertext.source.era];
  const targetEraColor = eraColors[intertext.target.era];

  return (
    <div
      style={{
        backgroundColor: '#1E1E24',
        color: '#F5F4F2',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        transform: isExpanded ? 'scale(1.03)' : 'scale(1)',
        cursor: 'pointer',
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>Intertext {intertext.id}</h3>
        <span style={{ 
            fontSize: '0.875rem', 
            color: '#9CA3AF',
            backgroundColor: '#334155',
            padding: '4px 8px',
            borderRadius: '4px',
            transition: 'background-color 0.3s ease',
            ':hover': { backgroundColor: '#4B5563' }
         }}>
          Strength: {intertext.strength}%
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <h4 style={{ color: '#C9A227', marginBottom: '4px', fontSize: '1rem' }}>Source Text <LanguageIndicator language={intertext.source.language} /></h4>
          <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.875rem' }}>
            <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Ref:</span> {intertext.source.ref}
            <br />
            <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Author:</span> {intertext.source.author}
            <br />
            <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Work:</span> {intertext.source.work}
            <br />
            <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Era:</span> {intertext.source.era}
              <span style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: sourceEraColor,
                marginLeft: '4px',
                verticalAlign: 'middle',
              }}></span>
            <br />
            <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Date:</span> {intertext.source.date}
          </p>
          <p style={{ marginTop: '8px', fontStyle: 'italic' }}>{intertext.source.text}</p>
        </div>

        <div>
          <h4 style={{ color: '#C9A227', marginBottom: '4px', fontSize: '1rem' }}>Target Text <LanguageIndicator language={intertext.target.language} /></h4>
          <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.875rem' }}>
            <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Ref:</span> {intertext.target.ref}
            <br />
            <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Author:</span> {intertext.target.author}
            <br />
            <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Work:</span> {intertext.target.work}
            <br />
            <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Era:</span> {intertext.target.era}
               <span style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: targetEraColor,
                marginLeft: '4px',
                verticalAlign: 'middle',
              }}></span>
            <br />
            <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>Date:</span> {intertext.target.date}
          </p>
          <p style={{ marginTop: '8px', fontStyle: 'italic' }}>{intertext.target.text}</p>
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <p style={{ margin: 0, color: '#F5F4F2' }}>
          <span style={{ fontWeight: 'bold' }}>Type:</span> {intertext.type}
          <br />
          <span style={{ fontWeight: 'bold' }}>Subtype:</span> {intertext.subtype}
        </p>
        <p style={{ marginTop: '8px', color: '#9CA3AF' }}>{intertext.description}</p>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '16px', borderTop: '1px solid #6B7280', paddingTop: '16px' }}>
          <h5 style={{ color: '#C9A227', marginBottom: '8px' }}>Connections:</h5>
          {intertext.connections.map((connection, index) => (
            <div key={index} style={{ marginBottom: '12px' }}>
              <p style={{ margin: 0, color: '#F5F4F2' }}>
                <span style={{ fontWeight: 'bold' }}>Source:</span> {connection.source}
                <br />
                <span style={{ fontWeight: 'bold' }}>Target:</span> {connection.target}
              </p>
              <p style={{ margin: '4px 0', color: '#9CA3AF' }}>
                <span style={{ fontWeight: 'bold' }}>Type:</span> {connection.type}
                <br />
                <span style={{ fontWeight: 'bold' }}>Reason:</span> {connection.reason}
              </p>
              {connection.lsj && (
                <p style={{ margin: '4px 0', color: '#9CA3AF', fontStyle: 'italic' }}>LSJ: {connection.lsj}</p>
              )}
              {connection.paradigm && (
                <div style={{ marginTop: '8px' }}>
                  <h6 style={{ color: '#C9A227', marginBottom: '4px' }}>Paradigm (Lemma: {connection.paradigm.lemma}):</h6>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                    {connection.paradigm.forms.map((form, i) => (
                      <li key={i} style={{ color: '#9CA3AF' }}>
                        {form.case && <span style={{ fontWeight: 'bold' }}>{form.case}:</span>} {form.tense && <span style={{ fontWeight: 'bold' }}>{form.tense}:</span>} {form.form}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          <h5 style={{ color: '#C9A227', marginBottom: '8px' }}>Semantic Drift:</h5>
          {intertext.semanticDrift.map((drift, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              <p style={{ margin: 0, color: '#F5F4F2' }}>
                <span style={{ fontWeight: 'bold' }}>Word:</span> {drift.word}
                <br />
                <span style={{ fontWeight: 'bold' }}>Period:</span> {drift.period}
                <br />
                <span style={{ fontWeight: 'bold' }}>Meaning:</span> {drift.meaning}
                <br />
                <span style={{ fontWeight: 'bold' }}>Frequency:</span> {drift.frequency}
              </p>
            </div>
          ))}

          <h5 style={{ color: '#C9A227', marginBottom: '8px' }}>Apparatus Criticus:</h5>
          <div>
            <p style={{ margin: 0, color: '#F5F4F2' }}>
              <span style={{ fontWeight: 'bold' }}>Manuscripts:</span> {intertext.apparatus.mss.join(', ')}
            </p>
            {intertext.apparatus.variants.map((variant, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <p style={{ margin: 0, color: '#F5F4F2' }}>
                  <span style={{ fontWeight: 'bold' }}>Lemma:</span> {variant.lemma}
                  <br />
                  <span style={{ fontWeight: 'bold' }}>Variants:</span> {variant.variants.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export default function IntertextList() {
  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', padding: '24px', minHeight: '100vh' }}>
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px', color: '#C9A227' }}>Intertextual Echoes</h1>
        <p style={{ fontSize: '1.125rem', color: '#9CA3AF' }}>Exploring the connections between ancient texts.</p>
      </header>

      <main>
        {INTERTEXTS.map(intertext => (
          <IntertextCard key={intertext.id} intertext={intertext} />
        ))}
      </main>

      <footer style={{ marginTop: '48px', borderTop: '1px solid #1E1E24', paddingTop: '24px', textAlign: 'center', color: '#6B7280' }}>
        <p>&copy; 2024 Logos Professional Design System</p>
      </footer>
    </div>
  );
}