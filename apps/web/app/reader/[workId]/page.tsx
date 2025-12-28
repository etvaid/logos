'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Bookmark, Loader, AlertCircle } from 'lucide-react';

export default function FullWorkReader() {
  const [text, setText] = useState<string[]>([]);
  const [translation, setTranslation] = useState<string[]>([]);
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [morphology, setMorphology] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/full-work');
        const data = await response.json();
        setText(data.text);
        setTranslation(data.translation);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleWordClick = async (word: string) => {
    try {
      const response = await fetch(`/api/morphology?word=${word}`);
      const data = await response.json();
      setMorphology(data.morphology);
    } catch (error) {
      setMorphology('Error fetching morphology');
    }
  };

  const toggleTranslation = () => setShowTranslation(!showTranslation);

  const bookmark = () => alert('Bookmarked!');

  if (loading) {
    return (
      <div style={{ color: '#F5F3EF', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader style={{ color: '#C9A962' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: '#DC2626', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <AlertCircle />
        <span style={{ marginLeft: '10px' }}>Failed to load text data</span>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0D0D0F', padding: '20px', color: '#F5F3EF' }}>
      <button
        onClick={bookmark}
        style={{
          background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
          color: '#0D0D0F',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        <Bookmark /> Bookmark
      </button>
      <button
        onClick={toggleTranslation}
        style={{
          background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
          color: '#0D0D0F',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '10px',
          marginLeft: '10px'
        }}
      >
        <BookOpen /> {showTranslation ? 'Hide' : 'Show'} Translation
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {text.map((line, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(30,30,36,0.8)',
              border: '1px solid rgba(201,169,98,0.15)',
              borderRadius: '5px',
              padding: '10px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 8px 0 rgba(201,169,98,0.3)',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ color: '#C9A962', marginRight: '10px' }}>{index + 1}</span>
            <span>
              {line.split(' ').map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  onClick={() => handleWordClick(word)}
                  style={{ cursor: 'pointer', color: '#F5F3EF', marginRight: '5px' }}
                >
                  {word}
                </span>
              ))}
            </span>
            {showTranslation && (
              <span style={{ color: 'rgba(245,243,239,0.7)', marginLeft: '10px' }}>
                {translation[index]}
              </span>
            )}
          </div>
        ))}
      </div>
      {morphology && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            background: 'rgba(30,30,36,0.8)',
            border: '1px solid rgba(201,169,98,0.15)',
            borderRadius: '5px',
            padding: '10px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 8px 0 rgba(201,169,98,0.3)',
            color: '#F5F3EF'
          }}
        >
          <strong>Morphology:</strong> {morphology}
        </div>
      )}
    </div>
  );
}