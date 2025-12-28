'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Loader, AlertCircle } from 'lucide-react';

export default function SemantiaWordDetail() {
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWordData = async () => {
      try {
        const response = await fetch('/api/word-detail');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setWordData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWordData();
  }, []);

  if (loading) return <div style={loadingStyle}><Loader style={{ color: '#C9A962' }} /></div>;
  if (error) return <div style={errorStyle}><AlertCircle /> {error.message}</div>;

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Semantic Analysis: {wordData.word}</h1>
        <div style={buttonStyle}><Search /> Search</div>
      </div>
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Full Semantic Analysis</h2>
        <p style={textStyle}>{wordData.semanticAnalysis}</p>
      </div>
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Era-by-Era Breakdown</h2>
        {wordData.eraBreakdown.map((era, index) => (
          <div key={index}>
            <h3 style={{ ...textStyle, color: eraColors[era.name] }}>{era.name}</h3>
            <p style={textStyle}>{era.description}</p>
          </div>
        ))}
      </div>
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Cross-Lingual Greek-Latin Matches</h2>
        <ul>
          {wordData.crossLingualMatches.map((match, index) => (
            <li key={index} style={textStyle}>
              <BookOpen style={{ color: '#3B82F6', marginRight: '8px' }} />
              {match}
            </li>
          ))}
        </ul>
      </div>
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Usage Frequency Chart</h2>
        {/* Placeholder for chart component */}
        <div style={chartStyle}>Chart goes here</div>
      </div>
    </div>
  );
}

const pageStyle = {
  backgroundColor: '#0D0D0F',
  color: '#F5F3EF',
  padding: '20px',
  minHeight: '100vh',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(201,169,98,0.15)',
  marginBottom: '20px',
  paddingBottom: '10px',
};

const titleStyle = {
  fontSize: '24px',
  color: '#C9A962',
};

const buttonStyle = {
  background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
  color: '#0D0D0F',
  padding: '10px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
};

const cardStyle = {
  background: 'rgba(30,30,36,0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '10px',
  padding: '20px',
  marginBottom: '20px',
  border: '1px solid rgba(201,169,98,0.15)',
  boxShadow: '0 4px 10px rgba(201,169,98,0.3)',
};

const sectionTitleStyle = {
  fontSize: '20px',
  color: '#E8D5A3',
  marginBottom: '10px',
};

const textStyle = {
  color: 'rgba(245,243,239,0.7)',
  marginBottom: '10px',
};

const chartStyle = {
  height: '200px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#C9A962',
  border: '1px solid rgba(201,169,98,0.15)',
  borderRadius: '5px',
};

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};

const errorStyle = {
  color: '#DC2626',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  fontSize: '18px',
};

const eraColors = {
  Archaic: '#8B4513',
  Classical: '#C9A962',
  Hellenistic: '#4A90A4',
  Roman: '#9B2335',
  LateAntique: '#6B4C8A',
  Byzantine: '#2E5A3E',
};