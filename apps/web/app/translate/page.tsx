'use client';
import React, { useState, useEffect } from 'react';

export default function TranslatePage() {
  const [sourceText, setSourceText] = useState('');
  const [translation, setTranslation] = useState('');
  const [sourceLang, setSourceLang] = useState('greek');
  const [style, setStyle] = useState('literal');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://logos-production-ef2b.up.railway.app';
      const res = await fetch(apiUrl + '/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sourceText, source_lang: sourceLang, style: style }),
      });
      if (!res.ok) throw new Error('Translation failed');
      const data = await res.json();
      setTranslation(data.translation);
    } catch (e) {
      setError('Translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e', color: '#fff', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>LOGOS Translator</h1>
      <div style={{ marginBottom: '1rem' }}>
        <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} style={{ padding: '0.5rem', marginRight: '1rem', background: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}>
          <option value="greek">Greek</option>
          <option value="latin">Latin</option>
        </select>
        <select value={style} onChange={(e) => setStyle(e.target.value)} style={{ padding: '0.5rem', background: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}>
          <option value="literal">Literal</option>
          <option value="literary">Literary</option>
          <option value="student">Student</option>
        </select>
      </div>
      <textarea
        value={sourceText}
        onChange={(e) => setSourceText(e.target.value)}
        placeholder="Enter Greek or Latin text..."
        style={{ width: '100%', height: '150px', padding: '1rem', fontSize: '1.1rem', background: '#333', color: '#fff', border: 'none', borderRadius: '8px', marginBottom: '1rem' }}
      />
      <button
        onClick={handleTranslate}
        disabled={isLoading}
        style={{ padding: '0.75rem 2rem', fontSize: '1rem', background: '#8B2635', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
        {isLoading ? 'Translating...' : 'Translate'}
      </button>
      {error && <p style={{ color: '#ff6b6b', marginTop: '1rem' }}>{error}</p>}
      {translation && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#333', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '1rem' }}>Translation</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{translation}</p>
        </div>
      )}
    </div>
  );
}
