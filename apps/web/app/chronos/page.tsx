'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader, AlertCircle } from 'lucide-react';

export default function Chronos() {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [selectedEra, setSelectedEra] = useState('Classical');
  const eras = ['Archaic', 'Classical', 'Hellenistic', 'Roman', 'Late Antique', 'Byzantine'];
  const eraColors = {
    'Archaic': '#8B4513',
    'Classical': '#C9A962',
    'Hellenistic': '#4A90A4',
    'Roman': '#9B2335',
    'Late Antique': '#6B4C8A',
    'Byzantine': '#2E5A3E'
  };

  useEffect(() => {
    if (word) {
      setLoading(true);
      fetch(`/api/meaning-drift?word=${word}`)
        .then(response => response.json())
        .then(data => {
          setData(data);
          setError('');
        })
        .catch(error => {
          setError('Failed to fetch data');
          setData(null);
        })
        .finally(() => setLoading(false));
    }
  }, [word]);

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value);
  };

  const handleEraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEra(e.target.value);
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F3EF', padding: '20px', minHeight: '100vh' }}>
      <h1 style={{ color: '#C9A962', marginBottom: '20px' }}>Chronos: Word Evolution</h1>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          value={word}
          onChange={handleWordChange}
          placeholder="Enter a word..."
          style={{
            padding: '10px',
            borderRadius: '5px',
            marginRight: '10px',
            background: 'rgba(30,30,36,0.8)',
            color: '#F5F3EF',
            border: '1px solid rgba(201,169,98,0.15)'
          }}
        />
        <Search color="#C9A962" />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <select onChange={handleEraChange} value={selectedEra} style={{
          padding: '10px',
          borderRadius: '5px',
          background: 'rgba(30,30,36,0.8)',
          color: '#F5F3EF',
          border: '1px solid rgba(201,169,98,0.15)'
        }}>
          {eras.map(era => (
            <option key={era} value={era} style={{ color: eraColors[era] }}>{era}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <Loader style={{ color: '#C9A962' }} />
      ) : error ? (
        <div style={{ color: '#DC2626', display: 'flex', alignItems: 'center' }}>
          <AlertCircle style={{ marginRight: '5px' }} />
          {error}
        </div>
      ) : data ? (
        <div>
          <h2 style={{ color: eraColors[selectedEra] }}>Meaning Drift ({selectedEra} Era)</h2>
          <p style={{ color: 'rgba(245,243,239,0.7)' }}>{data.meaningDrift[selectedEra]}</p>
          <h3 style={{ color: '#E8D5A3' }}>Example Quotes:</h3>
          <ul>
            {data.quotes[selectedEra].map((quote: string, index: number) => (
              <li key={index} style={{ marginBottom: '10px', background: 'rgba(30,30,36,0.8)', padding: '10px', borderRadius: '5px', border: '1px solid rgba(201,169,98,0.15)', boxShadow: `0px 4px 6px ${eraColors[selectedEra]}` }}>
                {quote}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ color: 'rgba(245,243,239,0.7)' }}>Enter a word to see its evolution.</p>
      )}
    </div>
  );
}