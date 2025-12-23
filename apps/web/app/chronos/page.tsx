'use client';

import React, { useState } from 'react';

const eraColors = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  lateAntique: '#7C3AED',
};

const languageColors = {
  Greek: '#3B82F6',
  Latin: '#DC2626',
};

const backgroundColor = '#0D0D0F';
const textColor = '#F5F4F2';
const accentColor = '#C9A227';

interface EraData {
  era: string;
  color: string;
  meaning: string;
  keyAuthors: string[];
  confidence: number;
  examplePassages: string[];
}

interface ConceptData {
  name: string;
  evolution: EraData[];
}

const areteData: ConceptData = {
  name: 'ἀρετή - Virtue',
  evolution: [
    {
      era: 'Archaic',
      color: eraColors.archaic,
      meaning: 'Excellence, often in a martial context.  Valor, strength, skill, and effectiveness. Tied closely to honor and reputation.',
      keyAuthors: ['Homer', 'Hesiod'],
      confidence: 90,
      examplePassages: [
        '“Always be the best, and distinguished above the others.” - Homer, Iliad',
      ],
    },
    {
      era: 'Classical',
      color: eraColors.classical,
      meaning: 'Moral virtue and excellence in all aspects of life. Striving for the highest potential and fulfilling one’s purpose.',
      keyAuthors: ['Plato', 'Aristotle'],
      confidence: 95,
      examplePassages: [
        '“Virtue, then, is a state of character concerned with choice, lying in a mean.” - Aristotle, Nicomachean Ethics',
      ],
    },
    {
      era: 'Hellenistic',
      color: eraColors.hellenistic,
      meaning: 'Internalized virtue, focused on tranquility (ataraxia) and freedom from disturbance.  Virtue as the path to happiness.',
      keyAuthors: ['Epicurus', 'Zeno of Citium'],
      confidence: 85,
      examplePassages: [
        '“Pleasure is the beginning and end of living happily.” - Epicurus, Letter to Menoeceus',
      ],
    },
    {
      era: 'Imperial',
      color: eraColors.imperial,
      meaning: 'Virtue emphasized as duty to the state and adherence to traditional Roman values. Strong emphasis on moral uprightness and civic responsibility.',
      keyAuthors: ['Seneca', 'Marcus Aurelius'],
      confidence: 75,
      examplePassages: [
        '“Live a good life. If there are gods and they are just, then they will not care how devout you have been, but will welcome you based on the virtues you have lived by.” - Marcus Aurelius, Meditations',
      ],
    },
    {
      era: 'Late Antique',
      color: eraColors.lateAntique,
      meaning: 'Virtue reinterpreted through a Christian lens.  Love, faith, hope, and charity become central.  Virtue is seen as obedience to God’s will.',
      keyAuthors: ['Augustine', 'Boethius'],
      confidence: 80,
      examplePassages: [
        '“Love, and do what thou wilt.” - Augustine, Homilies on the First Epistle of John',
      ],
    },
  ],
};

const logosData: ConceptData = {
  name: 'λόγος - Word/Reason',
  evolution: [
    {
      era: 'Archaic',
      color: eraColors.archaic,
      meaning: 'Spoken word, narrative, or account.  The power of speech to persuade and influence.',
      keyAuthors: ['Homer', 'Hesiod'],
      confidence: 80,
      examplePassages: [
        '“[Nestor] whose speech flowed from his mouth sweeter than honey.” - Homer, Iliad',
      ],
    },
    {
      era: 'Classical',
      color: eraColors.classical,
      meaning: 'Reason, principle, or rational order.  The underlying structure of the universe.  Logic and argument.',
      keyAuthors: ['Heraclitus', 'Plato', 'Aristotle'],
      confidence: 90,
      examplePassages: [
        '“Listening not to me but to the Logos it is wise to agree that all things are one.” - Heraclitus, Fragments',
      ],
    },
    {
      era: 'Hellenistic',
      color: eraColors.hellenistic,
      meaning: 'Cosmic reason, divine principle that governs the universe.  Stoicism: living in accordance with Logos leads to virtue and happiness.',
      keyAuthors: ['Zeno of Citium', 'Epictetus'],
      confidence: 85,
      examplePassages: [
        '“Do not seek to have events happen as you want them to, but instead want them to happen as they do happen, and your life will go well.” - Epictetus, Enchiridion',
      ],
    },
    {
      era: 'Imperial',
      color: eraColors.imperial,
      meaning: 'Rationality and the ability to persuade, central for a leader. Understanding the Logos helped rulers to govern effectively and justly.',
      keyAuthors: ['Cicero', 'Seneca'],
      confidence: 70,
      examplePassages: [
        '“Reason governs the soul.” - Cicero, Tusculan Disputations',
      ],
    },
    {
      era: 'Late Antique',
      color: eraColors.lateAntique,
      meaning: 'The Word of God, identified with Jesus Christ.  The divine principle through which the world was created and redeemed.',
      keyAuthors: ['John the Evangelist', 'Augustine'],
      confidence: 95,
      examplePassages: [
        '“In the beginning was the Word, and the Word was with God, and the Word was God.” - John 1:1',
      ],
    },
  ],
};

const dikeData: ConceptData = {
  name: 'δίκη - Justice',
  evolution: [
    {
      era: 'Archaic',
      color: eraColors.archaic,
      meaning: 'Custom, right, or justice as a divinely ordained order.  Retribution and vengeance are key aspects.  Maintaining cosmic balance.',
      keyAuthors: ['Homer', 'Hesiod'],
      confidence: 85,
      examplePassages: [
        '“Zeus, of all the gods, is the avenger of oaths.” - Homer, Iliad',
      ],
    },
    {
      era: 'Classical',
      color: eraColors.classical,
      meaning: 'Justice as a virtue, fairness, and what is right.  Emphasis on law and the state as instruments of justice.  Distributive justice.',
      keyAuthors: ['Plato', 'Aristotle'],
      confidence: 90,
      examplePassages: [
        '“Justice is the advantage of the stronger.” - Plato, Republic (Thrasymachus’ argument)',
        '“Justice is giving each person what they deserve.” - Aristotle, Nicomachean Ethics',
      ],
    },
    {
      era: 'Hellenistic',
      color: eraColors.hellenistic,
      meaning: 'Justice seen through the lens of natural law and universal principles.  Emphasis on equality and individual rights.',
      keyAuthors: ['Epicureans', 'Stoics'],
      confidence: 75,
      examplePassages: [
        '“Natural right is a pledge of mutual benefit, to prevent one man from injuring or being injured by another.” - Epicurus, Principal Doctrines',
      ],
    },
    {
      era: 'Imperial',
      color: eraColors.imperial,
      meaning: 'Justice codified in Roman law. Focus on legal procedures, rights of citizens, and the concept of natural law as the basis for legal systems.',
      keyAuthors: ['Cicero', 'Justinian'],
      confidence: 80,
      examplePassages: [
        '“Justice is the set and constant purpose which gives to every man his due.” - Justinian, Institutes',
      ],
    },
    {
      era: 'Late Antique',
      color: eraColors.lateAntique,
      meaning: 'Divine justice and judgment.  Justice as an attribute of God.  Emphasis on forgiveness, mercy, and the ultimate reckoning at the end of time.',
      keyAuthors: ['Augustine', 'Ambrose'],
      confidence: 95,
      examplePassages: [
        '“Justice being taken away, then, what are kingdoms but great robberies?” - Augustine, City of God',
      ],
    },
  ],
};

const concepts = [areteData, logosData, dikeData];

const ChronosPage: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<ConceptData | null>(null);

  const handleConceptClick = (concept: ConceptData) => {
    setSelectedConcept(concept);
  };

  return (
    <div style={{ backgroundColor, color: textColor, minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: accentColor }}>CHRONOS: Concept Evolution</h1>

      <div style={{ display: 'flex' }}>
        {/* Concept Selection */}
        <div style={{ width: '300px', paddingRight: '20px' }}>
          <h2 style={{ color: accentColor }}>Concepts</h2>
          <ul>
            {concepts.map((concept) => (
              <li
                key={concept.name}
                style={{ cursor: 'pointer', marginBottom: '10px', color: accentColor }}
                onClick={() => handleConceptClick(concept)}
              >
                {concept.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Concept Evolution Display */}
        <div style={{ flex: 1 }}>
          {selectedConcept ? (
            <>
              <h2 style={{ color: accentColor }}>{selectedConcept.name} Evolution</h2>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
              {/* Vertical Timeline */}
              <div style={{ position: 'relative', width: '50px' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '50%',
                    width: '2px',
                    backgroundColor: 'gray',
                    transform: 'translateX(-50%)',
                  }}
                />
                  {selectedConcept.evolution.map((eraData, index) => (
                    <div
                      key={eraData.era}
                      style={{
                        position: 'relative',
                        marginBottom: index === selectedConcept.evolution.length - 1 ? '0' : '40px',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '15px',
                          height: '15px',
                          borderRadius: '50%',
                          backgroundColor: eraData.color,
                          zIndex: 1,
                        }}
                      />
                    </div>
                  ))}
                </div>

                  {/* Era Data */}
                  <div style={{marginLeft: '30px'}}>
                    {selectedConcept.evolution.map((eraData) => (
                      <div
                        key={eraData.era}
                        style={{
                          marginBottom: '20px',
                          border: `1px solid ${eraData.color}`,
                          padding: '15px',
                          borderRadius: '8px',
                        }}
                      >
                        <h3 style={{ color: eraData.color, marginBottom: '5px' }}>
                          {eraData.era}
                        </h3>
                        <p><strong>Meaning:</strong> {eraData.meaning}</p>
                        <p>
                          <strong>Key Authors:</strong> {eraData.keyAuthors.join(', ')}
                        </p>
                        <p><strong>Confidence:</strong> {eraData.confidence}%</p>
                        <p>
                          <strong>Example Passages:</strong>
                          <ul>
                            {eraData.examplePassages.map((passage, index) => (
                              <li key={index}>{passage}</li>
                            ))}
                          </ul>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
            </>
          ) : (
            <p>Select a concept to view its evolution.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChronosPage;