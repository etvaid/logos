'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Spinner } from 'lucide-react';

export default function TranslationStudio() {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('literal');
  const [translation, setTranslation] = useState('');
  const [wordBreakdown, setWordBreakdown] = useState([]);
  const [ltqiScore, setLtqiScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTranslate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, style }),
      });

      if (!response.ok) throw new Error('Translation failed');

      const data = await response.json();
      setTranslation(data.translation);
      setWordBreakdown(data.wordBreakdown);
      setLtqiScore(data.ltqiScore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F3EF', padding: '20px', minHeight: '100vh' }}>
      <h1 style={{ color: '#C9A962', marginBottom: '20px' }}>Translation Studio</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: '100%',
          height: '100px',
          backgroundColor: '#1E1E24',
          border: '1px solid rgba(201,169,98,0.15)',
          color: '#F5F3EF',
          marginBottom: '20px',
          padding: '10px',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        {['literal', 'literary', 'student'].map((type) => (
          <button
            key={type}
            onClick={() => setStyle(type)}
            style={{
              background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
              color: '#0D0D0F',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              opacity: style === type ? 1 : 0.7,
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      <button
        onClick={handleTranslate}
        style={{
          background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
          color: '#0D0D0F',
          padding: '10px 20px',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Translate
      </button>
      {loading && <Spinner style={{ color: '#C9A962' }} />}
      {error && <p style={{ color: '#DC2626' }}>{error}</p>}
      {translation && (
        <>
          <div
            style={{
              background: 'rgba(30,30,36,0.8)',
              backdropFilter: 'blur(10px)',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              boxShadow: '0 4px 8px rgba(201,169,98,0.3)',
            }}
          >
            <h2 style={{ color: '#E8D5A3' }}>Translation</h2>
            <p>{translation}</p>
          </div>
          <div
            style={{
              background: 'rgba(30,30,36,0.8)',
              backdropFilter: 'blur(10px)',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              boxShadow: '0 4px 8px rgba(201,169,98,0.3)',
            }}
          >
            <h2 style={{ color: '#E8D5A3' }}>Word-by-Word Breakdown</h2>
            <table style={{ width: '100%', color: '#F5F3EF' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid rgba(201,169,98,0.15)' }}>Word</th>
                  <th style={{ borderBottom: '1px solid rgba(201,169,98,0.15)' }}>Translation</th>
                </tr>
              </thead>
              <tbody>
                {wordBreakdown.map((word, index) => (
                  <tr key={index}>
                    <td style={{ borderBottom: '1px solid rgba(201,169,98,0.15)', padding: '5px' }}>{word.original}</td>
                    <td style={{ borderBottom: '1px solid rgba(201,169,98,0.15)', padding: '5px' }}>{word.translation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            style={{
              background: 'rgba(30,30,36,0.8)',
              backdropFilter: 'blur(10px)',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(201,169,98,0.3)',
            }}
          >
            <h2 style={{ color: '#E8D5A3' }}>LTQI Score</h2>
            <p>{ltqiScore}</p>
          </div>
        </>
      )}
    </div>
  );
}