'use client';

import { useState, useEffect } from 'react';
import { Search, BookOpen, Loader } from 'lucide-react';

export default function Intertextuality() {
  const [passage, setPassage] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const findAllusions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/intertextuality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passage })
      });
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setResults(data.allusions);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F3EF', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: '#C9A962', marginBottom: '20px' }}>Intertextuality Analysis</h1>
      <div style={{ marginBottom: '20px', padding: '20px', background: 'rgba(30,30,36,0.8)', backdropFilter: 'blur(10px)', borderRadius: '10px' }}>
        <textarea
          value={passage}
          onChange={(e) => setPassage(e.target.value)}
          placeholder="Enter passage here..."
          style={{
            width: '100%',
            height: '100px',
            backgroundColor: '#1E1E24',
            border: '1px solid rgba(201,169,98,0.15)',
            color: '#F5F3EF',
            padding: '10px',
            borderRadius: '5px',
            resize: 'none'
          }}
        />
        <button
          onClick={findAllusions}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
            color: '#0D0D0F',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Search style={{ marginRight: '5px' }} />
          Find Allusions
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Loader style={{ color: '#C9A962', animation: 'spin 1s linear infinite' }} />
        </div>
      )}

      {error && (
        <div style={{ color: '#DC2626', marginTop: '20px' }}>
          <BookOpen style={{ marginRight: '5px' }} />
          {error}
        </div>
      )}

      <div>
        {results.map((result, index) => (
          <div key={index} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#1E1E24', border: '1px solid rgba(201,169,98,0.15)', borderRadius: '5px' }}>
            <h2 style={{ color: '#E8D5A3' }}>{result.type}</h2>
            <p style={{ color: 'rgba(245,243,239,0.7)' }}>
              Confidence: <span style={{ color: '#C9A962' }}>{result.confidence}%</span>
            </p>
            <a href={result.source} target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6', textDecoration: 'none' }}>
              Source Link
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}