'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = [
  '#F59E0B', // classical (gold)
  '#3B82F6', // hellenistic (blue)
  '#DC2626', // imperial (red)
  '#D97706', // archaic (amber)
  '#7C3AED', // lateAntique (purple)
  '#059669', // byzantine (green)
  '#E879F9',
  '#6EE7B7',
  '#F472B6',
  '#A78BFA',
];

interface InfluenceData {
  name: string;
  value: number;
  color: string;
}

const initialData: InfluenceData[] = [
  { name: 'Homeric (Iliad + Odyssey)', value: 45, color: COLORS[0] },
  { name: 'Hellenistic (Apollonius)', value: 20, color: COLORS[1] },
  { name: 'Ennius', value: 15, color: COLORS[2] },
  { name: 'Tragedy', value: 10, color: COLORS[3] },
  { name: 'Other', value: 10, color: COLORS[4] },
];

interface Allusion {
  source: string;
  target: string;
  text: string;
}

const demoAllusions: Allusion[] = [
  { source: 'Aeneid', target: 'Iliad', text: 'Arms and the man I sing...' },
  { source: 'Aeneid', target: 'Odyssey', text: 'Of trials and tribulations...' },
  { source: 'Aeneid', target: 'Apollonius', text: 'A golden fleece...' },
  { source: 'Aeneid', target: 'Ennius', text: 'Moribus antiquis res stat Romana virisque' },
];

const AuthorSelector = ({ onSelect }: { onSelect: (author: string) => void }) => {
  const [authors, setAuthors] = useState(['Virgil', 'Homer', 'Apollonius']); // Demo data

  useEffect(() => {
    // Fetch authors from API if needed
    // fetch('YOUR_API_ENDPOINT/authors')
    //   .then(res => res.json())
    //   .then(data => setAuthors(data));
  }, []);

  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      style={{
        backgroundColor: '#1E1E24',
        color: '#F5F4F2',
        border: '1px solid #C9A227',
        padding: '8px',
        borderRadius: '4px',
        marginBottom: '16px',
      }}
    >
      {authors.map((author) => (
        <option key={author} value={author}>
          {author}
        </option>
      ))}
    </select>
  );
};


const InfluenceTracer = () => {
  const [selectedAuthor, setSelectedAuthor] = useState('Virgil');
  const [influenceData, setInfluenceData] = useState<InfluenceData[]>(initialData);

  const handleAuthorSelect = (author: string) => {
    setSelectedAuthor(author);

    // Fetch influence data from API if needed
    // fetch(`YOUR_API_ENDPOINT/influences?author=${author}`)
    //   .then(res => res.json())
    //   .then(data => setInfluenceData(data));
    // For the demo, just using the same data
    setInfluenceData(initialData);
  };



  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Influence Tracer</h1>
      <AuthorSelector onSelect={handleAuthorSelect} />

      <h2>{selectedAuthor}'s Literary DNA</h2>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ width: '50%', marginRight: '20px' }}>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={influenceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {influenceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ color: '#F5F4F2' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: '50%' }}>
          <h3>Direct Allusions</h3>
          <ul>
            {demoAllusions.map((allusion, index) => (
              <li key={index} style={{ marginBottom: '8px', borderBottom: '1px solid #1E1E24', paddingBottom: '8px' }}>
                <strong>Source:</strong> {allusion.source}<br />
                <strong>Target:</strong> {allusion.target}<br />
                <strong>Text:</strong> <i>{allusion.text}</i>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3>Network Visualization (Simple)</h3>
        <p>
          [Simple Placeholder for Network Visualization.  Ideally use a library like Cytoscape.js or Vis.js to
          display a network graph here, showing connections between {selectedAuthor} and their influences.]
        </p>
      </div>
    </div>
  );
};

export default InfluenceTracer;