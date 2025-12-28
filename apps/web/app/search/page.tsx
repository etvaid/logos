'use client';
import React, { useState, useEffect } from 'react';
import { Search, BookOpen } from 'lucide-react';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState('all');
  const [era, setEra] = useState('all');
  const [author, setAuthor] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      fetch(`/api/search?query=${searchTerm}&language=${language}&era=${era}&author=${author}`)
        .then(response => response.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to fetch results');
          setLoading(false);
        });
    }
  }, [searchTerm, language, era, author]);

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F3EF', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid rgba(201,169,98,0.15)',
            backgroundColor: 'rgba(30,30,36,0.8)',
            color: '#F5F3EF',
            marginRight: '10px'
          }}
        />
        <Search size={20} color="#C9A962" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          style={{
            marginRight: '10px',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid rgba(201,169,98,0.15)',
            backgroundColor: 'rgba(30,30,36,0.8)',
            color: '#F5F3EF'
          }}
        >
          <option value="all">All Languages</option>
          <option value="greek" style={{ color: '#3B82F6' }}>Greek</option>
          <option value="latin" style={{ color: '#DC2626' }}>Latin</option>
        </select>
        <select
          value={era}
          onChange={e => setEra(e.target.value)}
          style={{
            marginRight: '10px',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid rgba(201,169,98,0.15)',
            backgroundColor: 'rgba(30,30,36,0.8)',
            color: '#F5F3EF'
          }}
        >
          <option value="all">All Eras</option>
          <option value="archaic" style={{ color: '#8B4513' }}>Archaic</option>
          <option value="classical" style={{ color: '#C9A962' }}>Classical</option>
          <option value="hellenistic" style={{ color: '#4A90A4' }}>Hellenistic</option>
          <option value="roman" style={{ color: '#9B2335' }}>Roman</option>
          <option value="late-antique" style={{ color: '#6B4C8A' }}>Late Antique</option>
          <option value="byzantine" style={{ color: '#2E5A3E' }}>Byzantine</option>
        </select>
        <input
          type="text"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="Author..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid rgba(201,169,98,0.15)',
            backgroundColor: 'rgba(30,30,36,0.8)',
            color: '#F5F3EF'
          }}
        />
      </div>
      <div>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #C9A962',
              borderTop: '4px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        ) : error ? (
          <div style={{ color: '#DC2626', padding: '20px' }}>{error}</div>
        ) : (
          <div>
            {results.map((result, index) => (
              <div key={index} style={{
                background: 'rgba(30,30,36,0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(201,169,98,0.15)',
                borderRadius: '5px',
                padding: '15px',
                marginBottom: '10px',
                boxShadow: `0 4px 8px ${'rgba(201,169,98,0.3)'}`
              }}>
                <h3 style={{ color: '#C9A962' }}>{result.title}</h3>
                <p style={{ color: 'rgba(245,243,239,0.7)' }}>{result.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}