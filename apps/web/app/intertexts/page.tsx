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
            { case: 'Nom.', form: 'ἄρχω' },
            { case: 'Gen.', form: 'ἄρχου' },
            { case: 'Dat.', form: 'ἄρχῳ' },
            { case: 'Acc.', form: 'ἄρχω' }
          ]
        }
      }
    ],
    semanticDrift: [
      { word: 'formas', period: 'Early Latin', meaning: 'shape, figure', frequency: 67 },
      { word: 'formas', period: 'Classical', meaning: 'form, appearance', frequency: 89 },
      { word: 'formas', period: 'Imperial', meaning: 'beauty, outward show', frequency: 72 }
    ]
  }
];

const EraColorMap = {
  'Archaic': '#D97706',
  'Classical': '#F59E0B',
  'Hellenistic': '#3B82F6',
  'Imperial': '#DC2626',
  'Late Antique': '#7C3AED',
  'Byzantine': '#059669',
};

const LanguageIndicator = ({ language }) => {
  const color = language === 'greek' ? '#3B82F6' : '#DC2626';
  const label = language === 'greek' ? 'Α' : 'L';

  return (
    <span style={{ 
      color: color, 
      fontSize: '0.8rem', 
      fontWeight: 'bold', 
      marginLeft: '0.5rem',
      transition: 'color 0.3s'
    }}>
      {label}
    </span>
  );
};

const IntertextCard = ({ intertext }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div 
      style={{ 
        backgroundColor: '#1E1E24', 
        color: '#F5F4F2', 
        padding: '1.5rem', 
        borderRadius: '0.5rem', 
        marginBottom: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s, box-shadow 0.3s',
        boxShadow: expanded ? '0 0.5rem 1rem rgba(0,0,0,0.3)' : '0 0.25rem 0.5rem rgba(0,0,0,0.1)',
      }}
      onClick={toggleExpanded}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#F5F4F2', margin: 0, transition: 'color 0.3s' }}>
          Intertext {intertext.id}
        </h3>
        <span style={{
          color: '#9CA3AF',
          fontSize: '0.875rem',
          transition: 'color 0.3s',
          display: 'flex',
          alignItems: 'center',
        }}>
          Strength: {intertext.strength}%
        </span>
      </div>

      <div style={{ marginBottom: '1rem', transition: 'opacity 0.3s', opacity: expanded ? 1 : 1 }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <strong style={{ color: '#C9A227', transition: 'color 0.3s' }}>Source:</strong> {intertext.source.ref} ({intertext.source.author}, <em>{intertext.source.work}</em>)
          <LanguageIndicator language={intertext.source.language} />
          <span style={{ color: '#6B7280', marginLeft: '0.5rem', fontSize: '0.75rem', transition: 'color 0.3s' }}>({intertext.source.era}, {intertext.source.date})</span>
          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', lineHeight: '1.4', fontFamily: 'serif' }}>{intertext.source.text}</p>
        </div>
        <div>
          <strong style={{ color: '#C9A227', transition: 'color 0.3s' }}>Target:</strong> {intertext.target.ref} ({intertext.target.author}, <em>{intertext.target.work}</em>)
          <LanguageIndicator language={intertext.target.language} />
          <span style={{ color: '#6B7280', marginLeft: '0.5rem', fontSize: '0.75rem', transition: 'color 0.3s' }}>({intertext.target.era}, {intertext.target.date})</span>
          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', lineHeight: '1.4', fontFamily: 'serif' }}>{intertext.target.text}</p>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '1rem', borderTop: '1px solid #6B7280', paddingTop: '1rem', transition: 'opacity 0.3s' }}>
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '0.5rem', transition: 'color 0.3s' }}>
            <strong style={{ color: '#C9A227', transition: 'color 0.3s' }}>Type:</strong> {intertext.type} ({intertext.subtype})
          </p>
          <p style={{ color: '#F5F4F2', fontSize: '0.9rem', lineHeight: '1.5', transition: 'color 0.3s' }}>
            <strong style={{ color: '#C9A227', transition: 'color 0.3s' }}>Description:</strong> {intertext.description}
          </p>

          {intertext.connections && intertext.connections.map((connection, index) => (
            <div key={index} style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#141419', borderRadius: '0.375rem', transition: 'background-color 0.3s' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '0.5rem', transition: 'color 0.3s' }}>Connection {index + 1}</h4>
              <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '0.25rem', transition: 'color 0.3s' }}>
                <strong style={{ color: '#C9A227', transition: 'color 0.3s' }}>Source:</strong> {connection.source}
              </p>
              <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '0.25rem', transition: 'color 0.3s' }}>
                <strong style={{ color: '#C9A227', transition: 'color 0.3s' }}>Target:</strong> {connection.target}
              </p>
              <p style={{ color: '#F5F4F2', fontSize: '0.9rem', transition: 'color 0.3s' }}>
                <strong style={{ color: '#C9A227', transition: 'color 0.3s' }}>Type:</strong> {connection.type} - {connection.reason}
              </p>
              {connection.lsj && (
                <p style={{ color: '#F5F4F2', fontSize: '0.9rem', transition: 'color 0.3s' }}>
                  <strong style={{ color: '#C9A227', transition: 'color 0.3s' }}>LSJ Entry:</strong> {connection.lsj}
                </p>
              )}
              {connection.paradigm && (
                <div>
                  <strong style={{ color: '#C9A227', transition: 'color 0.3s' }}>Paradigm:</strong>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
                    <thead>
                      <tr>
                        {Object.keys(connection.paradigm.forms[0]).map(header => (
                          <th key={header} style={{ color: '#9CA3AF', padding: '0.5rem', borderBottom: '1px solid #6B7280', textAlign: 'left', transition: 'color 0.3s' }}>
                            {header.toUpperCase()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {connection.paradigm.forms.map((form, index) => (
                        <tr key={index}>
                          {Object.values(form).map((value, i) => (
                            <td key={i} style={{ color: '#F5F4F2', padding: '0.5rem', borderBottom: '1px solid #6B7280', transition: 'color 0.3s' }}>
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          {intertext.semanticDrift && (
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '0.5rem', transition: 'color 0.3s' }}>Semantic Drift</h4>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {intertext.semanticDrift.map((drift, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem', color: '#9CA3AF', transition: 'color 0.3s' }}>
                    <strong style={{ color: '#C9A227', transition: 'color 0.3s' }}>{drift.word}:</strong> {drift.period} - {drift.meaning} (Frequency: {drift.frequency})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function Home() {
  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif', transition: 'background-color 0.3s, color 0.3s' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#F5F4F2', margin: 0, transition: 'color 0.3s' }}>Logos Professional Design System</h1>
        <p style={{ fontSize: '1.1rem', color: '#9CA3AF', margin: '0.5rem 0', transition: 'color 0.3s' }}>Intertextual Analysis Tool</p>
      </header>

      <main>
        {INTERTEXTS.map(intertext => (
          <IntertextCard key={intertext.id} intertext={intertext} />
        ))}
      </main>

      <footer style={{ marginTop: '3rem', textAlign: 'center', color: '#6B7280', fontSize: '0.875rem', transition: 'color 0.3s' }}>
        <p>
          &copy; 2024 Logos. All rights reserved.  
        </p>
      </footer>
    </div>
  );
}