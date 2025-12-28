'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Globe, Users, MapPin } from 'lucide-react';

const mapTypes = [
  { id: 1, title: 'Political Maps', img: 'path/to/political.jpg', route: '/maps/political' },
  { id: 2, title: 'Language Maps', img: 'path/to/language.jpg', route: '/maps/language' },
  { id: 3, title: 'Authors Maps', img: 'path/to/authors.jpg', route: '/maps/authors' },
  { id: 4, title: 'Sites Maps', img: 'path/to/sites.jpg', route: '/maps/sites' },
  { id: 5, title: 'Trade Maps', img: 'path/to/trade.jpg', route: '/maps/trade' },
];

export default function MapsHub() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maps, setMaps] = useState([]);

  useEffect(() => {
    const fetchMaps = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/maps');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMaps(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMaps();
  }, []);

  const handleCardClick = (route) => {
    window.location.href = route;
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#C9A962', fontSize: '24px' }}>Loading...</div>
        <div className="spinner" style={{ marginLeft: '10px' }}>🔄</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', height: '100vh', color: '#DC2626', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0D0D0F', padding: '20px', color: '#F5F3EF' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Maps Hub</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {mapTypes.map((map) => (
          <div 
            key={map.id} 
            style={{ 
              background: 'rgba(30,30,36,0.8)', 
              backdropFilter: 'blur(10px)', 
              border: '1px solid rgba(201,169,98,0.15)', 
              borderRadius: '10px', 
              cursor: 'pointer', 
              padding: '10px', 
              textAlign: 'center' 
            }} 
            onClick={() => handleCardClick(map.route)}
          >
            <img src={map.img} alt={map.title} style={{ width: '100%', borderRadius: '10px', marginBottom: '10px' }} />
            <h2 style={{ color: '#C9A962' }}>{map.title}</h2>
            <button style={{ 
              background: 'linear-gradient(135deg, #C9A962, #E8D5A3)', 
              color: '#0D0D0F', 
              border: 'none', 
              borderRadius: '5px', 
              padding: '10px 15px', 
              cursor: 'pointer' 
            }}>
              <Search size={16} /> View More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}