'use client';

import React, { useState, useEffect } from 'react';
import { Download, Loader } from 'lucide-react';

export default function PoliticalMap() {
  const [time, setTime] = useState(800);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch(`/api/map/${time}`);
        if (!response.ok) throw new Error('Failed to fetch map data');
        const data = await response.text();
        setSvgContent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchMapData();
  }, [time]);

  const downloadSVG = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `political_map_${time}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      backgroundColor: '#0D0D0F', color: '#F5F3EF', padding: '20px', minHeight: '100vh',
    }}>
      <div style={{
        border: '1px solid rgba(201,169,98,0.15)', background: 'rgba(30,30,36,0.8)', backdropFilter: 'blur(10px)',
        borderRadius: '10px', padding: '20px', marginBottom: '20px',
      }}>
        <h1 style={{ color: '#C9A962', textAlign: 'center' }}>Political Map of the Mediterranean</h1>
        {loading ? <Loader style={{ color: '#C9A962', display: 'block', margin: '20px auto' }} /> : null}
        {error ? <p style={{ color: '#DC2626', textAlign: 'center' }}>{error}</p> : null}
        <div dangerouslySetInnerHTML={{ __html: svgContent }} style={{ textAlign: 'center' }} />
        <input
          type="range"
          min="800"
          max="500"
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
          style={{ width: '100%', margin: '20px 0', accentColor: '#C9A962' }}
        />
        <p style={{ textAlign: 'center', color: 'rgba(245,243,239,0.7)' }}>
          Year: {time} {time < 0 ? 'BCE' : 'CE'}
        </p>
        <button onClick={downloadSVG} style={{
          background: 'linear-gradient(135deg, #C9A962, #E8D5A3)', color: '#0D0D0F',
          padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(201,169,98,0.3)', display: 'block', margin: '0 auto',
        }}>
          <Download style={{ marginRight: '5px' }} /> Download SVG
        </button>
      </div>
    </div>
  );
}