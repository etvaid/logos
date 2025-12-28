'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen } from 'lucide-react';

function BrowseCorpus() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEra, setSelectedEra] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    async function fetchAuthors() {
      try {
        const response = await fetch('/api/authors');
        if (!response.ok) throw new Error('Failed to fetch authors');
        const data = await response.json();
        setAuthors(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAuthors();
  }, []);

  const handleEraChange = (event) => {
    setSelectedEra(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const filterAuthors = () => {
    return authors.filter(author => {
      return (
        (selectedEra ? author.era === selectedEra : true) &&
        (selectedLanguage ? author.language === selectedLanguage : true)
      );
    });
  };

  if (loading) {
    return <div style={{ color: '#F5F3EF', textAlign: 'center' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: '#DC2626', textAlign: 'center' }}>{error}</div>;
  }

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <select onChange={handleEraChange} style={{ background: 'rgba(30,30,36,0.8)', color: '#F5F3EF', border: 'none', padding: '10px', borderRadius: '5px', backdropFilter: 'blur(10px)' }}>
          <option value="">All Eras</option>
          <option value="Archaic" style={{ color: '#8B4513' }}>Archaic</option>
          <option value="Classical" style={{ color: '#C9A962' }}>Classical</option>
          <option value="Hellenistic" style={{ color: '#4A90A4' }}>Hellenistic</option>
          <option value="Roman" style={{ color: '#9B2335' }}>Roman</option>
          <option value="Late Antique" style={{ color: '#6B4C8A' }}>Late Antique</option>
          <option value="Byzantine" style={{ color: '#2E5A3E' }}>Byzantine</option>
        </select>
        <select onChange={handleLanguageChange} style={{ background: 'rgba(30,30,36,0.8)', color: '#F5F3EF', border: 'none', padding: '10px', borderRadius: '5px', backdropFilter: 'blur(10px)' }}>
          <option value="">All Languages</option>
          <option value="Greek" style={{ color: '#3B82F6' }}>Greek</option>
          <option value="Latin" style={{ color: '#DC2626' }}>Latin</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {filterAuthors().map((author) => (
          <div key={author.id} style={{ background: 'rgba(30,30,36,0.8)', color: '#F5F3EF', border: '1px solid rgba(201,169,98,0.15)', borderRadius: '10px', padding: '15px', boxShadow: '0 4px 6px rgba(201,169,98,0.3)', backdropFilter: 'blur(10px)', cursor: 'pointer' }} onClick={() => alert(`Viewing works of ${author.name}`)}>
            <h3 style={{ color: '#C9A962' }}>{author.name}</h3>
            <p style={{ color: 'rgba(245,243,239,0.7)' }}>Era: {author.era}</p>
            <p style={{ color: 'rgba(245,243,239,0.7)' }}>Language: {author.language}</p>
            <p style={{ color: 'rgba(245,243,239,0.7)' }}>Works: {author.works.length}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', color: '#E8D5A3' }}>
              <BookOpen />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrowseCorpus;