'use client';

import React from 'react';

const Archaic = '#D97706'; // amber
const Classical = '#F59E0B'; // gold
const Hellenistic = '#3B82F6'; // blue
const ImperialRome = '#DC2626'; // red
const LateAntiquity = '#7C3AED'; // purple
const Byzantine = '#059669'; // emerald

const Greek = '#3B82F6'; // blue
const Latin = '#DC2626'; // red
const Hebrew = '#059669'; // green
const Syriac = '#D97706'; // amber

const Literary = '#3B82F6';
const Epigraphic = '#10B981';
const Archaeological = '#8B5CF6';
const Numismatic = '#EF4444';

const Background = '#0D0D0F';
const SecondaryBG = '#1E1E24';
const TextColor = '#F5F4F2';
const Accent = '#C9A227';

interface Author {
  name: string;
  fragmentsCount: number;
  lostContent: string;
  reconstructionProgress: string;
  survivingLines: number;
  lostLines: number;
  reconstructedStanzas: { stanza: string; confidence: string; }[];
  sources: string[];
}

const sappho: Author = {
  name: 'Sappho',
  fragmentsCount: 650,
  lostContent: '~9,000 lines (9 books)',
  reconstructionProgress: 'In Progress',
  survivingLines: 650,
  lostLines: 9000,
  reconstructedStanzas: [
    { stanza: '...fragment of beauty...', confidence: '75%' },
    { stanza: '...love like a fire...', confidence: '80%' },
    { stanza: '...golden Aphrodite...', confidence: '85%' },
  ],
  sources: ['Athenaeus', 'Apollonius Dyscolus', 'Papyri'],
};

const livy: Author = {
  name: 'Livy',
  fragmentsCount: 142,
  lostContent: '~Unknown lines',
  reconstructionProgress: 'Planned',
  survivingLines: 32000,
  lostLines: 400000,
  reconstructedStanzas: [],
  sources: [],
};

const cicero: Author = {
  name: 'Cicero',
  fragmentsCount: 3000,
  lostContent: '~Unknown lines',
  reconstructionProgress: 'In Progress',
  survivingLines: 200000,
  lostLines: 100000,
  reconstructedStanzas: [],
  sources: [],
};

const ennius: Author = {
  name: 'Ennius',
  fragmentsCount: 100,
  lostContent: '~Unknown lines',
  reconstructionProgress: 'Planned',
  survivingLines: 250,
  lostLines: 10000,
  reconstructedStanzas: [],
  sources: [],
};

const AuthorCard: React.FC<{ author: Author }> = ({ author }) => {
  return (
    <div style={{ backgroundColor: SecondaryBG, padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', color: TextColor }}>
      <h3>{author.name}</h3>
      <p>Fragments Count: {author.fragmentsCount}</p>
      <p>Estimated Lost Content: {author.lostContent}</p>
      <p>Reconstruction Progress: {author.reconstructionProgress}</p>
    </div>
  );
};

const FragmentViewer: React.FC<{ author: Author }> = ({ author }) => {
  return (
    <div style={{ backgroundColor: SecondaryBG, padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', color: TextColor }}>
      <h4>Fragment Viewer</h4>
      {author.reconstructedStanzas.map((stanza, index) => (
        <div key={index}>
          <p>{stanza.stanza}</p>
          <small>Confidence: {stanza.confidence}</small>
        </div>
      ))}
      <h5>Sources</h5>
      <ul>
        {author.sources.map((source, index) => (
          <li key={index}>{source}</li>
        ))}
      </ul>
    </div>
  );
};


const GhostAuthorResurrection: React.FC = () => {
  return (
    <div style={{ backgroundColor: Background, color: TextColor, padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: Accent }}>Recovering Lost Masterpieces</h1>
      <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Using advanced AI to resurrect the voices of antiquity.</p>

      <section>
        <h2>Featured Authors</h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <AuthorCard author={sappho} />
          <AuthorCard author={livy} />
          <AuthorCard author={cicero} />
          <AuthorCard author={ennius} />
        </div>
      </section>

      <section>
        <h2>Sappho Reconstruction Demo</h2>
        <FragmentViewer author={sappho} />
      </section>

      <section style={{marginTop: '2rem'}}>
        <h2>Reconstruction Laboratory</h2>
        <p>Adjust parameters and contribute to the reconstruction process. (Coming Soon)</p>
      </section>

      <footer style={{marginTop: '3rem', borderTop: `1px solid ${Accent}`, paddingTop: '1rem'}}>
        <p><strong>Marketing Claims:</strong></p>
        <ul>
          <li>{`"World's largest searchable classical corpus"`}</li>
          <li>{`"1.7+ million passages"`}</li>
          <li>{`"892,000 semantic embeddings"`}</li>
          <li>{`"500,000+ intertextual connections"`}</li>
          <li>{`"5-layer analysis system"`}</li>
        </ul>

        <p>&copy; 2024 Logos Design System</p>
      </footer>

    </div>
  );
};

export default GhostAuthorResurrection;