'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Loader } from 'lucide-react';

export default function LanguageMap() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    fetch('/api/language-map')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F3EF', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: '#C9A962', textAlign: 'center' }}>Language Map</h1>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Loader color="#C9A962" size={48} />
        </div>
      ) : error ? (
        <div style={{ color: '#DC2626', textAlign: 'center' }}>Error fetching data</div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <input
              type="range"
              min="0"
              max="100"
              value={time}
              onChange={handleTimeChange}
              style={{
                width: '80%',
                background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
                outline: 'none',
                appearance: 'none',
              }}
            />
          </div>
          <div style={{ position: 'relative', margin: 'auto', width: '80%', height: '60vh', background: 'rgba(30,30,36,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(201,169,98,0.15)' }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
              <circle cx="30" cy="50" r="20" fill="#3B82F6" opacity={time / 100} />
              <circle cx="70" cy="50" r="20" fill="#DC2626" opacity={time / 100} />
              <path d="M10,30 L90,30 L90,70 L10,70 Z" fill="none" stroke="#F5F3EF" strokeWidth="0.5" />
            </svg>
          </div>
          <div style={{ margin: '20px', textAlign: 'center', color: 'rgba(245,243,239,0.7)' }}>
            <p>Greek and Latin language spread over time. Adjust the slider to view changes.</p>
          </div>
        </div>
      )}
    </div>
  );
}