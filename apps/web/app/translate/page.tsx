'use client';
import React, { useState } from 'react';

const API_URL = 'https://logos-production-ef2b.up.railway.app';

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
      const res = await fetch(API_URL + '/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sourceText, source_lang: sourceLang, style: style }),
      });
      if (!res.ok) throw new Error('Translation failed');
      const data = await res.json();
      setTranslation(data.translation);
    } catch (e) {
      setError('Translation failed. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">LOGOS Translator</h1>
        
        <div className="flex gap-4 mb-6">
          <select 
            value={sourceLang} 
            onChange={(e) => setSourceLang(e.target.value)}
            className="px-4 py-2 bg-gray-700 rounded-lg border border-gray-600"
          >
            <option value="greek">Greek</option>
            <option value="latin">Latin</option>
          </select>
          
          <select 
            value={style} 
            onChange={(e) => setStyle(e.target.value)}
            className="px-4 py-2 bg-gray-700 rounded-lg border border-gray-600"
          >
            <option value="literal">Literal</option>
            <option value="literary">Literary</option>
            <option value="student">Student-friendly</option>
          </select>
        </div>

        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Enter Greek or Latin text here..."
          className="w-full h-40 p-4 bg-gray-700 rounded-lg border border-gray-600 text-lg mb-4"
        />

        <button
          onClick={handleTranslate}
          disabled={isLoading || !sourceText.trim()}
          className="w-full py-3 bg-red-800 hover:bg-red-700 disabled:bg-gray-600 rounded-lg font-semibold text-lg transition-colors"
        >
          {isLoading ? 'Translating...' : 'Translate'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            {error}
          </div>
        )}

        {translation && (
          <div className="mt-8 p-6 bg-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Translation ({style})</h2>
            <p className="text-lg leading-relaxed">{translation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
