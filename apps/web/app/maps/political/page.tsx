'use client';

import React, { useState, useEffect } from 'react';

const POLITICAL_DATA = {
  '500 BCE': {
    regions: {
      'region1': 'Persian', // Replace with actual SVG region IDs
      'region2': 'Persian',
      'region3': 'Greek',
      'region4': 'Greek',
      'region5': 'Greek',
    },
    events: ['Rise of Persian Empire']
  },
  '323 BCE': {
    regions: {
      'region1': 'Greek',
      'region2': 'Greek',
      'region3': 'Greek',
      'region4': 'Greek',
      'region5': 'Greek',
    },
    events: ['Death of Alexander']
  },
  '100 BCE': {
    regions: {
      'region1': 'Roman',
      'region2': 'Roman',
      'region3': 'Roman',
      'region4': 'Greek',
      'region5': 'Greek',
    },
    events: ['Roman Expansion']
  },
  '1 CE': {
    regions: {
      'region1': 'Roman',
      'region2': 'Roman',
      'region3': 'Roman',
      'region4': 'Roman',
      'region5': 'Roman',
    },
    events: ['Roman Empire at its Height']
  },
  '400 CE': {
    regions: {
      'region1': 'Roman',
      'region2': 'Roman',
      'region3': 'Roman',
      'region4': 'Roman',
      'region5': 'Roman',
    },
    events: ['Fall of Western Roman Empire']
  }
};

const SVG_PATH_DATA = {
  'region1': "M10 10 L50 10 L50 50 L10 50 Z",
  'region2': "M60 10 L100 10 L100 50 L60 50 Z",
  'region3': "M10 60 L50 60 L50 100 L10 100 Z",
  'region4': "M60 60 L100 60 L100 100 L60 100 Z",
  'region5': "M35 35 L75 35 L75 75 L35 75 Z"
};


const MapComponent = () => {
  const [selectedYear, setSelectedYear] = useState<string>('500 BCE');
  const [politicalData, setPoliticalData] = useState(POLITICAL_DATA['500 BCE']);

  useEffect(() => {
    setPoliticalData(POLITICAL_DATA[selectedYear]);
  }, [selectedYear]);

  const eraColors = {
    Persian: '#7C3AED', // Purple
    Greek: '#3B82F6',  // Blue
    Roman: '#DC2626',  // Red
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedYear(event.target.value);
  };


  const availableYears = Object.keys(POLITICAL_DATA);

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', padding: '20px' }}>
      <h1>Political Control Map</h1>

      {/* Time Slider */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="yearSlider">Year: {selectedYear}</label>
        <input
          type="range"
          id="yearSlider"
          min="0"
          max={availableYears.length -1}
          value={availableYears.indexOf(selectedYear)}
          onChange={handleYearChange}
          style={{ width: '100%' }}
          list="yearMarkers"
        />
        <datalist id="yearMarkers">
          {availableYears.map((year, index) => (
            <option key={index} value={index} label={year} />
          ))}
        </datalist>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          {availableYears.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* SVG Map */}
      <svg width="500" height="300" style={{ backgroundColor: '#1E1E24' }}>
        {Object.entries(SVG_PATH_DATA).map(([regionId, pathData]) => (
          <path
            key={regionId}
            d={pathData}
            fill={eraColors[politicalData.regions[regionId]] || '#808080'} // Default grey if no data
            stroke="#0D0D0F"
            strokeWidth="2"
          />
        ))}
      </svg>

      {/* Legend */}
      <div style={{ marginTop: '20px' }}>
        <h3>Legend</h3>
        {Object.entries(eraColors).map(([power, color]) => (
          <div key={power} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: color, marginRight: '10px' }}></div>
            <span>{power}</span>
          </div>
        ))}
      </div>

      {/* Key Events */}
      <div>
        <h3>Events</h3>
        <ul>
          {politicalData.events.map((event, index) => (
            <li key={index}>{event}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MapComponent;