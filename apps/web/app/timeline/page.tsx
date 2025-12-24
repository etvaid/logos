
'use client';

import { useState } from 'react';
import Link from 'next/link';

const EVENTS = [
  { year: -800, name: "Homer composes epics", category: "intellectual", era: "archaic" },
  { year: -776, name: "First Olympic Games", category: "cultural", era: "archaic" },
  { year: -490, name: "Battle of Marathon", category: "political", era: "classical" },
  { year: -399, name: "Death of Socrates", category: "intellectual", era: "classical" },
  { year: -323, name: "Death of Alexander", category: "political", era: "hellenistic" },
  { year: -44, name: "Caesar assassinated", category: "political", era: "imperial" },
  { year: 33, name: "Crucifixion", category: "religious", era: "imperial" },
  { year: 79, name: "Vesuvius erupts", category: "cultural", era: "imperial" },
  { year: 313, name: "Edict of Milan", category: "religious", era: "lateAntique" },
  { year: 410, name: "Sack of Rome", category: "political", era: "lateAntique" },
  { year: 476, name: "Fall of Western Empire", category: "political", era: "lateAntique" },
  { year: 529, name: "Academy closes", category: "intellectual", era: "byzantine" },
];

const ERA_COLORS: Record<string, string> = { archaic: '#D97706', classical: '#F59E0B', hellenistic: '#3B82F6', imperial: '#DC2626', lateAntique: '#7C3AED', byzantine: '#059669' };
const CAT_ICONS: Record<string, string> = { political: '👑', intellectual: '📚', religious: '⛪', cultural: '🎭' };

export default function TimelinePage() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? EVENTS : EVENTS.filter(e => e.category === filter);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <nav style={{ borderBottom: '1px solid #2D2D35', padding: '16px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>LOGOS</Link>
          <Link href="/maps" style={{ color: '#9CA3AF', textDecoration: 'none' }}>← Back to Maps</Link>
        </div>
      </nav>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#C9A227', marginBottom: '8px' }}>Classical Timeline</h1>
        <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>2,300 years of history</p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          {['all', 'political', 'intellectual', 'religious', 'cultural'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '10px 20px', backgroundColor: filter === f ? '#C9A227' : '#1E1E24', color: filter === f ? '#0D0D0F' : '#F5F4F2', border: '1px solid #2D2D35', borderRadius: '8px', cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>

        <div style={{ position: 'relative', paddingLeft: '60px' }}>
          <div style={{ position: 'absolute', left: '28px', top: '0', bottom: '0', width: '4px', backgroundColor: '#2D2D35' }}></div>
          {filtered.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '32px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-32px', width: '24px', height: '24px', backgroundColor: ERA_COLORS[e.era], borderRadius: '50%', border: '4px solid #0D0D0F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{CAT_ICONS[e.category]}</div>
              <div style={{ flex: 1, padding: '16px 24px', backgroundColor: '#1E1E24', borderRadius: '12px', borderLeft: `4px solid ${ERA_COLORS[e.era]}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{e.name}</span>
                  <span style={{ color: '#C9A227', fontSize: '14px' }}>{e.year < 0 ? `${Math.abs(e.year)} BCE` : `${e.year} CE`}</span>
                </div>
                <span style={{ padding: '4px 12px', backgroundColor: `${ERA_COLORS[e.era]}20`, color: ERA_COLORS[e.era], borderRadius: '4px', fontSize: '12px', textTransform: 'capitalize' }}>{e.era}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
