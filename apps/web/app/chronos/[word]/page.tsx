'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ArrowRightCircle } from 'lucide-react';

export default function ChronosWordDetail() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wordDetails, setWordDetails] = useState<any>(null);
  const [selectedEra, setSelectedEra] = useState<string | null>(null);

  useEffect(() => {
    const fetchWordDetails = async () => {
      try {
        const response = await fetch('/api/word-details');
        if (!response.ok) {
          throw new Error('Failed to fetch word details');
        }
        const data = await response.json();
        setWordDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWordDetails();
  }, []);

  const handleEraClick = (era: string) => {
    setSelectedEra(era);
  };

  if (loading) {
    return (
      <div style={{ color: '#F5F3EF', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Search style={{ color: '#C9A962' }} />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: '#F5F3EF', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <span>Error: {error}</span>
      </div>
    );
  }

  const eras = [
    { name: 'Archaic', color: '#8B4513' },
    { name: 'Classical', color: '#C9A962' },
    { name: 'Hellenistic', color: '#4A90A4' },
    { name: 'Roman', color: '#9B2335' },
    { name: 'Late Antique', color: '#6B4C8A' },
    { name: 'Byzantine', color: '#2E5A3E' },
  ];

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F3EF', padding: '20px', minHeight: '100vh' }}>
      <h1 style={{ borderBottom: '1px solid rgba(201,169,98,0.15)', paddingBottom: '10px' }}>Chronos Word Detail</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        <div style={{ backgroundColor: '#1E1E24', border: '1px solid rgba(201,169,98,0.15)', borderRadius: '8px', padding: '20px', backdropFilter: 'blur(10px)', background: 'rgba(30,30,36,0.8)' }}>
          <h2>1500-Year Timeline</h2>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            {eras.map((era) => (
              <div key={era.name} style={{ flex: 1, backgroundColor: era.color, height: '20px', cursor: 'pointer' }} onClick={() => handleEraClick(era.name)} />
            ))}
          </div>
        </div>
        <div style={{ backgroundColor: '#1E1E24', border: '1px solid rgba(201,169,98,0.15)', borderRadius: '8px', padding: '20px', backdropFilter: 'blur(10px)', background: 'rgba(30,30,36,0.8)' }}>
          <h2>Era-by-Era Meanings</h2>
          {selectedEra ? (
            <div>
              <h3 style={{ color: eras.find((era) => era.name === selectedEra)?.color }}>{selectedEra}</h3>
              <p>{wordDetails[selectedEra]}</p>
            </div>
          ) : (
            <p>Select an era to see details</p>
          )}
        </div>
        <div style={{ backgroundColor: '#1E1E24', border: '1px solid rgba(201,169,98,0.15)', borderRadius: '8px', padding: '20px', backdropFilter: 'blur(10px)', background: 'rgba(30,30,36,0.8)' }}>
          <h2>Drift Score Percentage</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5em' }}>
            <BookOpen style={{ color: '#C9A962' }} />
            <span>{wordDetails.driftScore}%</span>
          </div>
        </div>
        <button style={{ background: 'linear-gradient(135deg, #C9A962, #E8D5A3)', color: '#0D0D0F', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', alignSelf: 'flex-start' }}>
          Learn More <ArrowRightCircle style={{ marginLeft: '10px' }} />
        </button>
      </div>
    </div>
  );
}