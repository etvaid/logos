'use client';
import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Loader } from 'lucide-react';

export default function DiscoveryEngine() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInsight, setSelectedInsight] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch('/api/insights');
        if (!response.ok) throw new Error('Failed to fetch insights');
        const data = await response.json();
        setInsights(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const handleExportBibTeX = (citation) => {
    const blob = new Blob([citation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'citation.bib';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', padding: '20px', color: '#F5F3EF', minHeight: '100vh' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ color: '#C9A962' }}>Discovery Engine</h1>
      </header>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Loader style={{ color: '#C9A962', width: '50px', height: '50px' }} />
        </div>
      ) : error ? (
        <div style={{ color: '#DC2626', textAlign: 'center' }}>
          <p>Error: {error}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {insights.map((insight, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(30,30,36,0.8)',
                border: '1px solid rgba(201,169,98,0.15)',
                padding: '15px',
                borderRadius: '10px',
                boxShadow: `0 4px 8px ${insight.noveltyScore > 0.8 ? '#C9A962' : 'rgba(0,0,0,0.2)'}`,
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedInsight(insight)}
            >
              <h2 style={{ color: '#E8D5A3' }}>{insight.title}</h2>
              <p style={{ color: 'rgba(245,243,239,0.7)' }}>{insight.description}</p>
              <p><strong>Novelty Score:</strong> {insight.noveltyScore}</p>
              <p><strong>Evidence:</strong> {insight.evidence.length} citations</p>
            </div>
          ))}
        </div>
      )}
      {selectedInsight && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(30,30,36,0.8)',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid rgba(201,169,98,0.15)',
            boxShadow: `0 4px 20px ${'#C9A962'}`,
            zIndex: 1000,
          }}
        >
          <h2 style={{ color: '#E8D5A3' }}>{selectedInsight.title}</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <h3>Evidence Citations</h3>
            <ul>
              {selectedInsight.evidence.map((citation, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  <p style={{ color: 'rgba(245,243,239,0.7)' }}>{citation}</p>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
                      color: '#0D0D0F',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      boxShadow: `0 2px 5px ${'#C9A962'}`,
                    }}
                    onClick={() => handleExportBibTeX(citation)}
                  >
                    Export to BibTeX
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button
            style={{
              background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
              color: '#0D0D0F',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'block',
              marginTop: '15px',
              boxShadow: `0 2px 5px ${'#C9A962'}`,
              width: '100%',
            }}
            onClick={() => setSelectedInsight(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}