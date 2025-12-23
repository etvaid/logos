'use client';

import React from 'react';
import Link from 'next/link';

const backgroundColor = '#0D0D0F';
const textColor = '#F5F4F2';
const accentColor = '#C9A227';

const eraColors = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  lateAntique: '#7C3AED',
};

const languageColors = {
  greek: '#3B82F6',
  latin: '#DC2626',
};

const cardData = [
  {
    title: 'Language Distribution',
    description: 'Explore the geographical spread of Greek and Latin.',
    icon: '🌐',
    path: '/maps/languages',
    gradient: `linear-gradient(to right, ${languageColors.greek}, ${languageColors.latin})`,
  },
  {
    title: 'Political Control',
    description: 'Visualize the shifting political landscape of the era.',
    icon: '🏛️',
    path: '/maps/political',
    gradient: `linear-gradient(to right, ${eraColors.archaic}, ${eraColors.imperial})`,
  },
  {
    title: 'Author Origins',
    description: 'Discover the birthplaces and movements of key authors.',
    icon: '✍️',
    path: '/maps/authors',
    gradient: `linear-gradient(to right, ${eraColors.classical}, ${eraColors.hellenistic})`,
  },
  {
    title: 'Trade Routes',
    description: 'Trace the flow of goods and ideas across the ancient world.',
    icon: '🚢',
    path: '/maps/trade',
    gradient: `linear-gradient(to right, ${accentColor}, ${eraColors.imperial})`,
  },
  {
    title: 'Timeline',
    description: 'A chronological overview of key events and developments.',
    icon: '⏳',
    path: '/timeline',
    gradient: `linear-gradient(to right, ${eraColors.archaic}, ${eraColors.lateAntique})`,
  },
  {
    title: 'Libraries',
    description: 'Locate and explore the great libraries of antiquity.',
    icon: '📚',
    path: '/maps/libraries',
    gradient: `linear-gradient(to right, ${eraColors.classical}, ${eraColors.imperial})`,
  },
];

const MapsHubPage = () => {
  return (
    <div style={{ backgroundColor, color: textColor, padding: '20px' }}>
      <h1>Maps Hub</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {cardData.map((card, index) => (
          <Link key={index} href={card.path} passHref style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: card.gradient,
                padding: '20px',
                borderRadius: '8px',
                color: textColor,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s ease-in-out',
                cursor: 'pointer',
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'

              }}
              >
              <div>
                <h2 style={{ marginBottom: '5px' }}>{card.title}</h2>
                <p style={{ fontSize: '14px', opacity: 0.8 }}>{card.description}</p>
              </div>
              <div style={{ fontSize: '2em', textAlign: 'right' }}>{card.icon}</div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MapsHubPage;