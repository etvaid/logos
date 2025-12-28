'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader } from 'lucide-react';

export default function TextPrediction() {
  const [inputText, setInputText] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handlePredict = async () => {
    if (inputText.trim() === '') {
      setError('Input cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      });
      if (!response.ok) throw new Error('Failed to fetch predictions');
      const data = await response.json();
      setPredictions(data.hypotheses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F3EF', padding: '2rem', minHeight: '100vh' }}>
      <h1 style={{ color: '#C9A962', textAlign: 'center', marginBottom: '2rem' }}>Text Prediction</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <textarea
          style={{
            width: '80%',
            height: '100px',
            backgroundColor: '#1E1E24',
            color: '#F5F3EF',
            border: '1px solid rgba(201,169,98,0.15)',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '4px',
            resize: 'none'
          }}
          placeholder="Enter damaged text with [lacuna] markers..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <button
          style={{
            background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
            color: '#0D0D0F',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={handlePredict}
        >
          <Search style={{ marginRight: '0.5rem' }} /> Predict
        </button>
      </div>
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <Loader style={{ color: '#C9A962', animation: 'spin 1s linear infinite' }} />
        </div>
      )}
      {error && <div style={{ color: '#DC2626', textAlign: 'center', marginBottom: '2rem' }}>{error}</div>}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            background: 'rgba(30,30,36,0.8)',
            backdropFilter: 'blur(10px)',
            padding: '1rem',
            borderRadius: '5px',
            width: '80%'
          }}
        >
          {predictions.length > 0 && (
            <div>
              <h2 style={{ color: '#E8D5A3', marginBottom: '1rem' }}>Hypotheses</h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {predictions.map((prediction, index) => (
                  <li
                    key={index}
                    style={{
                      backgroundColor: '#1E1E24',
                      border: '1px solid rgba(201,169,98,0.15)',
                      borderRadius: '4px',
                      marginBottom: '0.5rem',
                      padding: '0.5rem',
                      boxShadow: '0 4px 8px rgba(201,169,98,0.3)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#F5F3EF' }}>{prediction.text}</span>
                      <span style={{ color: '#3B82F6' }}>{Math.round(prediction.confidence * 100)}%</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}