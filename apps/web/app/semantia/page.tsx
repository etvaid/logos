'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Loader, AlertCircle } from 'lucide-react';

export default function SemantiaPage() {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [semantics, setSemantics] = useState(null);

  useEffect(() => {
    if (word) {
      fetchSemantics(word);
    }
  }, [word]);

  const fetchSemantics = async (query: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/semantics?word=${query}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setSemantics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F3EF', minHeight: '100vh', padding: '20px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#C9A962' }}>Semantia</h1>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <input
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(201,169,98,0.15)',
              background: 'rgba(30,30,36,0.8)',
              backdropFilter: 'blur(10px)',
              color: '#F5F3EF',
              width: '300px',
            }}
            type="text"
            placeholder="Enter a word..."
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          <Search style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', color: '#C9A962' }} />
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', color: '#C9A962' }}>
          <Loader />
        </div>
      )}

      {error && (
        <div style={{ color: '#DC2626', textAlign: 'center' }}>
          <AlertCircle /> {error}
        </div>
      )}

      {semantics && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ color: '#E8D5A3' }}>Semantic Neighbors</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {semantics.neighbors.map((neighbor: string, index: number) => (
              <div key={index} style={{ margin: '10px', padding: '10px', borderRadius: '8px', background: 'rgba(30,30,36,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(201,169,98,0.15)' }}>
                {neighbor}
              </div>
            ))}
          </div>

          <h2 style={{ color: '#E8D5A3' }}>Usage Examples</h2>
          <ul>
            {semantics.examples.map((example: string, index: number) => (
              <li key={index} style={{ marginBottom: '10px', color: 'rgba(245,243,239,0.7)' }}>
                <BookOpen /> {example}
              </li>
            ))}
          </ul>

          <h2 style={{ color: '#E8D5A3' }}>Comparison vs LSJ Dictionary</h2>
          <div style={{ borderRadius: '8px', background: 'rgba(30,30,36,0.8)', backdropFilter: 'blur(10px)', padding: '20px', marginTop: '10px', border: '1px solid rgba(201,169,98,0.15)' }}>
            <p style={{ color: 'rgba(245,243,239,0.7)' }}>{semantics.lsjComparison}</p>
          </div>

          <h2 style={{ color: '#E8D5A3' }}>Confidence Bars</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {semantics.confidence.map((conf: { label: string, value: number }, index: number) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ flex: '1', color: 'rgba(245,243,239,0.7)' }}>{conf.label}</span>
                <div style={{ flex: '3', height: '10px', marginLeft: '10px', background: 'rgba(30,30,36,0.8)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${conf.value}%`, height: '100%', background: 'linear-gradient(135deg, #C9A962, #E8D5A3)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}