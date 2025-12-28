'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Loader, AlertCircle } from 'lucide-react';

export default function LexiconEntry() {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEntry() {
      try {
        const response = await fetch('/api/lexicon-entry');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setEntry(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEntry();
  }, []);

  const renderSenses = () => (
    entry.senses.map((sense, index) => (
      <div key={index} style={{ marginBottom: '16px', color: '#F5F3EF' }}>
        <h3 style={{ color: '#C9A962' }}>Sense {index + 1}</h3>
        <p>{sense.definition}</p>
        <div style={{ fontStyle: 'italic', color: 'rgba(245,243,239,0.7)' }}>
          {sense.citations.map((citation, idx) => (
            <span key={idx} style={{ display: 'block' }}>
              "{citation.text}" - {citation.source}
            </span>
          ))}
        </div>
      </div>
    ))
  );

  const renderEtymology = () => (
    <div style={{ marginTop: '20px', color: '#F5F3EF' }}>
      <h2 style={{ color: '#E8D5A3' }}>Etymology</h2>
      <p>{entry.etymology}</p>
    </div>
  );

  const renderRelatedWords = () => (
    <div style={{ marginTop: '20px', color: '#F5F3EF' }}>
      <h2 style={{ color: '#C9A962' }}>Related Words</h2>
      <ul>
        {entry.relatedWords.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ul>
    </div>
  );

  const renderContent = () => (
    <div style={{ padding: '24px', background: 'rgba(30,30,36,0.8)', backdropFilter: 'blur(10px)', borderRadius: '8px', border: '1px solid rgba(201,169,98,0.15)' }}>
      <h1 style={{ color: '#E8D5A3' }}>{entry.title}</h1>
      {renderSenses()}
      {renderEtymology()}
      {renderRelatedWords()}
      <a href="/semantia" style={{ marginTop: '20px', display: 'inline-block', textDecoration: 'none', padding: '10px 20px', background: 'linear-gradient(135deg, #C9A962, #E8D5A3)', color: '#0D0D0F', borderRadius: '5px' }}>
        Explore SEMANTIA
      </a>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0D0D0F' }}>
        <Loader color="#C9A962" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0D0D0F', color: '#DC2626' }}>
        <AlertCircle size={48} />
        <p style={{ marginTop: '16px' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0D0D0F', padding: '40px 20px', minHeight: '100vh' }}>
      {entry && renderContent()}
    </div>
  );
}