'use client';
import React, { useState, useEffect } from 'react';
import { Search, BookOpen } from 'lucide-react';

export default function Lexicon() {
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState('greek');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    if (searchTerm) {
      fetchResults();
    }
  }, [searchTerm, language]);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/${language}?query=${searchTerm}`);
      const data = await response.json();
      setResults(data.entries);
    } catch (err) {
      setError('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLanguageToggle = () => {
    setLanguage((prevLang) => (prevLang === 'greek' ? 'latin' : 'greek'));
  };

  const handleEntryClick = (entry: any) => {
    setSelectedEntry(entry);
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F3EF', padding: '20px' }}>
      <h1 style={{ color: '#C9A962' }}>Lexicon</h1>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchInputChange}
          placeholder="Search..."
          style={{
            backgroundColor: 'rgba(30,30,36,0.8)',
            color: '#F5F3EF',
            border: '1px solid rgba(201,169,98,0.15)',
            padding: '10px',
            marginRight: '10px',
            borderRadius: '4px',
            backdropFilter: 'blur(10px)',
          }}
        />
        <button
          onClick={handleLanguageToggle}
          style={{
            background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
            color: '#0D0D0F',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {language === 'greek' ? 'Switch to Latin' : 'Switch to Greek'}
        </button>
      </div>
      {loading && <div style={{ color: '#C9A962' }}>Loading...</div>}
      {error && <div style={{ color: '#DC2626' }}>{error}</div>}
      <div>
        {results.map((entry: any, index: number) => (
          <div
            key={index}
            onClick={() => handleEntryClick(entry)}
            style={{
              background: 'rgba(30,30,36,0.8)',
              color: '#F5F3EF',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid rgba(201,169,98,0.15)',
              borderRadius: '4px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              boxShadow: '0px 4px 10px rgba(201,169,98,0.3)',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#E8D5A3' }}>
              <BookOpen size={16} style={{ marginRight: '5px' }} />
              {entry.term}
            </h3>
            <p style={{ margin: '0', color: 'rgba(245,243,239,0.7)' }}>
              {entry.definition}
            </p>
          </div>
        ))}
      </div>
      {selectedEntry && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1E1E24',
            color: '#F5F3EF',
            padding: '20px',
            border: '1px solid rgba(201,169,98,0.15)',
            borderRadius: '8px',
            boxShadow: '0px 4px 20px rgba(201,169,98,0.3)',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
          }}
        >
          <h2 style={{ color: '#C9A962' }}>{selectedEntry.term}</h2>
          <p>{selectedEntry.fullDefinition}</p>
          <button
            onClick={() => setSelectedEntry(null)}
            style={{
              background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
              color: '#0D0D0F',
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}