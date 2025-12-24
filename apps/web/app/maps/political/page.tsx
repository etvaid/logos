'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

const eraColors: Record<string, string> = { archaic: '#D97706', classical: '#F59E0B', hellenistic: '#3B82F6', imperial: '#DC2626', late_antique: '#7C3AED' };

export default function PoliticalMapPage() {
  const [year, setYear] = useState(-400);
  const svgRef = useRef<SVGSVGElement>(null);

  const getEra = (y: number) => { if (y < -500) return 'archaic'; if (y < -323) return 'classical'; if (y < -31) return 'hellenistic'; if (y < 284) return 'imperial'; return 'late_antique'; };
  const formatYear = (y: number) => y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`;
  const era = getEra(year);

  const downloadSVG = () => {
    if (!svgRef.current) return;
    const data = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([data], { type: 'image/svg+xml' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `map-${year}.svg`; a.click();
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>🏛️ LOGOS</span></Link>
        <button onClick={downloadSVG} style={{ padding: '8px 16px', backgroundColor: '#C9A227', color: '#0D0D0F', border: 'none', borderRadius: 4, cursor: 'pointer' }}>📥 Download SVG</button>
      </nav>
      <div style={{ padding: 24 }}>
        <h1 style={{ color: '#C9A227', marginBottom: 24 }}>🏛️ Political Map</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: 16, backgroundColor: '#1E1E24', borderRadius: 8 }}>
          <span style={{ color: '#6B7280' }}>800 BCE</span>
          <input type="range" min={-800} max={500} value={year} onChange={(e) => setYear(parseInt(e.target.value))} style={{ flex: 1, accentColor: '#C9A227' }} />
          <span style={{ color: '#6B7280' }}>500 CE</span>
          <span style={{ color: eraColors[era], fontWeight: 'bold', minWidth: 100 }}>{formatYear(year)}</span>
          <span style={{ color: eraColors[era], textTransform: 'capitalize' }}>{era.replace('_', ' ')}</span>
        </div>
        <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 16 }}>
          <svg ref={svgRef} viewBox="0 0 800 400" style={{ width: '100%', height: 'auto' }}>
            <rect width="800" height="400" fill="#0D0D0F" />
            <ellipse cx="400" cy="220" rx="350" ry="120" fill="#1a3a5c" opacity="0.6" />
            <path d="M120 100 L200 80 L280 120 L260 180 L180 200 L100 160 Z" fill={eraColors[era]} opacity="0.7" />
            <text x="180" y="140" fill="#F5F4F2" fontSize="12">Greece</text>
            <path d="M100 220 L180 200 L220 240 L200 300 L120 310 L80 280 Z" fill={year > -200 ? eraColors[era] : '#4B5563'} opacity="0.7" />
            <text x="140" y="260" fill="#F5F4F2" fontSize="12">Italy</text>
            <circle cx="200" cy="140" r="4" fill="#C9A227" /><text x="210" y="144" fill="#C9A227" fontSize="10">Athens</text>
            <circle cx="140" cy="260" r="4" fill="#C9A227" /><text x="150" y="264" fill="#C9A227" fontSize="10">Rome</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
