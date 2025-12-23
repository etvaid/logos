'use client';

import React, { useState } from 'react';

// Era colors
const archaicColor = '#D97706';
const classicalColor = '#F59E0B';
const hellenisticColor = '#3B82F6';
const imperialColor = '#DC2626';
const lateAntiqueColor = '#7C3AED';

// Language colors
const greekColor = '#3B82F6';
const latinColor = '#DC2626';

// Background, text, and accent colors
const backgroundColor = '#0D0D0F';
const textColor = '#F5F4F2';
const accentColor = '#C9A227';

interface RegionData {
  language: string;
  color: string;
  description: string;
}

const initialLanguageData: { [key: string]: RegionData } = {
  Greece: {
    language: 'Greek',
    color: greekColor,
    description: 'Predominantly Greek-speaking during most periods.',
  },
  Italy: {
    language: 'Latin',
    color: latinColor,
    description: 'Predominantly Latin-speaking during most periods.',
  },
  Egypt: {
    language: 'Greek & Egyptian',
    color: greekColor,
    description: 'Mixture of Greek and Egyptian, with Greek becoming dominant in cities.',
  },
  Levant: {
    language: 'Multiple Languages',
    color: accentColor,
    description: 'Mixture of Aramaic, Greek, and other local languages.',
  },
};

const LanguageMap: React.FC = () => {
  const [year, setYear] = useState(500); // Initial year
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(parseInt(event.target.value, 10));
  };

  const getRegionColor = (regionName: string): string => {
      if(year < -300){
          switch (regionName){
            case 'Greece': return greekColor;
            case 'Italy': return latinColor;
            case 'Egypt': return greekColor;
            case 'Levant': return accentColor;
            default: return backgroundColor;
          }
      } else if (year < 0){
          switch (regionName){
            case 'Greece': return greekColor;
            case 'Italy': return latinColor;
            case 'Egypt': return greekColor;
            case 'Levant': return accentColor;
            default: return backgroundColor;
          }
      } else if(year < 200){
          switch (regionName){
            case 'Greece': return greekColor;
            case 'Italy': return latinColor;
            case 'Egypt': return greekColor;
            case 'Levant': return accentColor;
            default: return backgroundColor;
          }
      } else {
        switch (regionName){
          case 'Greece': return greekColor;
          case 'Italy': return latinColor;
          case 'Egypt': return greekColor;
          case 'Levant': return accentColor;
          default: return backgroundColor;
        }
      }

  };

  const hoveredData = hoveredRegion ? initialLanguageData[hoveredRegion] : null;

  return (
    <div style={{ backgroundColor, color: textColor, padding: '20px' }}>
      <h1>Language Distribution in the Mediterranean (500 BCE - 500 CE)</h1>

      <div>
        <label htmlFor="yearSlider">Year: {year} BCE/CE</label>
        <input
          type="range"
          id="yearSlider"
          min="-500"
          max="500"
          step="50"
          value={year}
          onChange={handleYearChange}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ display: 'flex' }}>
        <svg width="600" height="400" style={{ border: '1px solid #555' }}>
          {/* Mediterranean Map */}
          <g>
            <path
              id="Greece"
              d="M 100,150 L 150,100 L 200,150 L 180,200 L 120,220 Z"
              fill={getRegionColor('Greece')}
              stroke="#222"
              strokeWidth="2"
              onMouseEnter={() => setHoveredRegion('Greece')}
              onMouseLeave={() => setHoveredRegion(null)}
              style={{ cursor: 'pointer' }}
            />
            <path
              id="Italy"
              d="M 50,50 L 80,80 L 120,50 L 150,80 L 130,130 L 90,100 Z"
              fill={getRegionColor('Italy')}
              stroke="#222"
              strokeWidth="2"
              onMouseEnter={() => setHoveredRegion('Italy')}
              onMouseLeave={() => setHoveredRegion(null)}
              style={{ cursor: 'pointer' }}
            />
            <path
              id="Egypt"
              d="M 300,250 L 350,250 L 370,300 L 320,350 L 280,300 Z"
              fill={getRegionColor('Egypt')}
              stroke="#222"
              strokeWidth="2"
              onMouseEnter={() => setHoveredRegion('Egypt')}
              onMouseLeave={() => setHoveredRegion(null)}
              style={{ cursor: 'pointer' }}
            />
            <path
              id="Levant"
              d="M 350,180 L 400,150 L 450,200 L 420,250 L 370,220 Z"
              fill={getRegionColor('Levant')}
              stroke="#222"
              strokeWidth="2"
              onMouseEnter={() => setHoveredRegion('Levant')}
              onMouseLeave={() => setHoveredRegion(null)}
              style={{ cursor: 'pointer' }}
            />
          </g>
        </svg>

        <div style={{ marginLeft: '20px' }}>
          <h2>Language Legend</h2>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: greekColor, marginRight: '5px' }}></div>
            <span>Greek</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: latinColor, marginRight: '5px' }}></div>
            <span>Latin</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: accentColor, marginRight: '5px' }}></div>
            <span>Multiple Languages</span>
          </div>
        </div>
      </div>

      {hoveredData && (
        <div style={{ marginTop: '20px', border: '1px solid #888', padding: '10px' }}>
          <h3>Region: {hoveredRegion}</h3>
          <p>Language: {hoveredData.language}</p>
          <p>Description: {hoveredData.description}</p>
        </div>
      )}
    </div>
  );
};

export default LanguageMap;