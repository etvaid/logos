'use client';

import Link from 'next/link';

const BACKGROUND = '#0D0D0F';
const SECONDARY = '#1E1E24';
const TEXT = '#F5F4F2';
const GOLD_ACCENT = '#C9A227';

const eraColors = {
  archaic: '#D97706', // amber
  classical: '#F59E0B', // gold
  hellenistic: '#3B82F6', // blue
  imperial: '#DC2626', // red
  lateAntique: '#7C3AED', // purple
  byzantine: '#059669', // green
};

const maps = [
  {
    title: 'Language Distribution',
    description: 'Where Greek, Latin dominated',
    link: '/maps/languages',
    gradient: `linear-gradient(to right, ${eraColors.classical}, ${eraColors.imperial})`,
  },
  {
    title: 'Political Control',
    description: '2000 years of empires',
    link: '/maps/political',
    gradient: `linear-gradient(to right, ${eraColors.imperial}, ${eraColors.byzantine})`,
  },
  {
    title: 'Trade Routes',
    description: 'Ancient commerce',
    link: '/maps/trade',
    gradient: `linear-gradient(to right, ${eraColors.archaic}, ${eraColors.classical})`,
  },
  {
    title: 'Author Origins',
    description: 'Where writers came from',
    link: '/maps/authors',
    gradient: `linear-gradient(to right, ${eraColors.hellenistic}, ${eraColors.lateAntique})`,
  },
  {
    title: 'Libraries & Schools',
    description: 'Centers of learning',
    link: '/maps/libraries',
    gradient: `linear-gradient(to right, ${eraColors.classical}, ${eraColors.hellenistic})`,
  },
  {
    title: 'Manuscript Survival',
    description: 'How texts survived',
    link: '/maps/manuscripts',
    gradient: `linear-gradient(to right, ${eraColors.lateAntique}, ${eraColors.byzantine})`,
  },
];

export default function MapsHub() {
  return (
    <div style={{ backgroundColor: BACKGROUND, color: TEXT, minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: GOLD_ACCENT }}>Maps Hub</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {maps.map((map, index) => (
          <Link key={index} href={map.link} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              style={{
                background: map.gradient,
                padding: '1.5rem',
                borderRadius: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                transition: 'transform 0.2s ease-in-out',
                ':hover': { transform: 'scale(1.05)' },
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{map.title}</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.4' }}>{map.description}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>Explore</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}