'use client';

import { useState, useEffect } from 'react';
import { Loader, AlertCircle, CheckCircle, Search } from 'lucide-react';

export default function MeterScanner() {
  const [text, setText] = useState('');
  const [scanned, setScanned] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/scan-hexameter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Scan failed');
      const data = await response.json();
      setScanned(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F3EF', minHeight: '100vh', padding: '20px', fontFamily: 'Crimson Pro' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond', color: '#C9A962' }}>Meter Scanner</h1>
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter hexameter text..."
          style={{ backgroundColor: '#1E1E24', color: '#F5F3EF', padding: '10px', border: 'none', borderRadius: '5px', resize: 'vertical' }}
        />
        <button
          onClick={handleScan}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#C9A962', color: '#0D0D0F', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Scan <Search style={{ marginLeft: '5px' }} />
        </button>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E8D5A3' }}>
            <Loader style={{ marginRight: '5px' }} /> Loading...
          </div>
        )}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
            <AlertCircle style={{ marginRight: '5px' }} /> {error}
          </div>
        )}
        {scanned && (
          <div style={{ marginTop: '20px', backgroundColor: '#1E1E24', padding: '10px', borderRadius: '5px' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond', color: '#E8D5A3' }}>Scan Result:</h3>
            <div style={{ color: '#3B82F6' }}>
              {scanned.map((word, index) => (
                <span
                  key={index}
                  onClick={() => alert(`Word: ${word.text}, Meter: ${word.meter}`)}
                  style={{ cursor: 'pointer', marginRight: '5px', color: word.language === 'greek' ? '#3B82F6' : '#DC2626' }}
                >
                  {word.text}
                </span>
              ))}
            </div>
          </div>
        )}
        {scanned && (
          <div style={{ marginTop: '20px', backgroundColor: '#1E1E24', padding: '10px', borderRadius: '5px' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond', color: '#E8D5A3' }}>Visualization:</h3>
            <div style={{ color: '#F5F3EF' }}>
              {scanned.map((word, index) => (
                <div
                  key={index}
                  style={{
                    display: 'inline-block',
                    marginRight: '5px',
                    padding: '5px',
                    border: '1px solid #C9A962',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    backgroundColor: word.meter === 'dactyl' ? '#3B82F6' : word.meter === 'spondee' ? '#DC2626' : '#E8D5A3',
                  }}
                  onClick={() => alert(`Word: ${word.text}, Meter: ${word.meter}`)}
                >
                  {word.text}
                </div>
              ))}
            </div>
          </div>
        )}
        {scanned && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px', color: '#3B82F6' }}>
            <CheckCircle style={{ marginRight: '5px' }} /> Scan complete
          </div>
        )}
      </div>
    </div>
  );
}