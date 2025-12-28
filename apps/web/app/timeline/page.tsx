'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Loader2 } from 'lucide-react';

export default function Timeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [filter, zoom]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch('/api/timeline-events');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (category) => {
    setFilter(category);
  };

  const handleZoomChange = (event) => {
    setZoom(event.target.value);
  };

  const renderEventMarkers = () => {
    return events.map((event, index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: `${index * 100 * zoom}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: '#1E1E24',
          border: '1px solid rgba(201,169,98,0.15)',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: `0 4px 6px ${'rgba(201,169,98,0.3)'}`,
          color: '#F5F3EF',
          cursor: 'pointer',
        }}
      >
        <div style={{ fontWeight: 'bold', color: event.color }}>
          {event.title}
        </div>
        <div style={{ color: 'rgba(245,243,239,0.7)' }}>{event.date}</div>
        <div style={{ marginTop: '5px' }}>{event.description}</div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: '#0D0D0F',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#F5F3EF',
        }}
      >
        <Loader2 size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          backgroundColor: '#0D0D0F',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#DC2626',
        }}
      >
        <p>Error loading events. Please try again later.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#0D0D0F',
        color: '#F5F3EF',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{
              background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
              color: '#0D0D0F',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => handleFilterChange('political')}
          >
            Political
          </button>
          <button
            style={{
              background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
              color: '#0D0D0F',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => handleFilterChange('literary')}
          >
            Literary
          </button>
          <button
            style={{
              background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
              color: '#0D0D0F',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => handleFilterChange('philosophical')}
          >
            Philosophical
          </button>
          <button
            style={{
              background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
              color: '#0D0D0F',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
        </div>
        <div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={zoom}
            onChange={handleZoomChange}
            style={{
              cursor: 'pointer',
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: 'relative',
          height: '200px',
          width: '100%',
          overflowX: 'scroll',
          background: 'rgba(30,30,36,0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        {renderEventMarkers()}
      </div>
    </div>
  );
}