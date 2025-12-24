'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Node { id: string; name: string; era: string; x: number; y: number; }
interface Edge { source: string; target: string; type: string; strength: number; }

const eraColors: Record<string, string> = { archaic: '#D97706', classical: '#F59E0B', hellenistic: '#3B82F6', imperial: '#DC2626', late_antique: '#7C3AED' };

export default function ConnectomePage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Node | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => { fetch('/api/authors/connections').then(r => r.json()).then(d => { setNodes(d.nodes || []); setEdges(d.edges || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  useEffect(() => {
    if (nodes.length === 0) return;
    const interval = setInterval(() => {
      setNodes(prev => {
        const next = prev.map(n => ({ ...n }));
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const dx = next[j].x - next[i].x, dy = next[j].y - next[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 500 / (dist * dist);
            next[i].x -= (dx / dist) * force * 0.1; next[j].x += (dx / dist) * force * 0.1;
            next[i].y -= (dy / dist) * force * 0.1; next[j].y += (dy / dist) * force * 0.1;
          }
        }
        for (const e of edges) {
          const s = next.find(n => n.id === e.source), t = next.find(n => n.id === e.target);
          if (s && t) {
            const dx = t.x - s.x, dy = t.y - s.y, dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = (dist - 80) * 0.01;
            s.x += (dx / dist) * force; t.x -= (dx / dist) * force;
            s.y += (dy / dist) * force; t.y -= (dy / dist) * force;
          }
        }
        next.forEach(n => { n.x = Math.max(30, Math.min(570, n.x)); n.y = Math.max(30, Math.min(370, n.y)); });
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [nodes.length, edges]);

  const downloadSVG = () => {
    if (!svgRef.current) return;
    const data = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([data], { type: 'image/svg+xml' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'connectome.svg'; a.click();
  };

  if (loading) return <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#C9A227' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>🏛️ LOGOS</span></Link>
        <button onClick={downloadSVG} style={{ padding: '8px 16px', backgroundColor: '#C9A227', color: '#0D0D0F', border: 'none', borderRadius: 4, cursor: 'pointer' }}>📥 Download SVG</button>
      </nav>
      <div style={{ padding: 24 }}>
        <h1 style={{ color: '#C9A227', marginBottom: 24 }}>🕸️ Author Connectome</h1>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1, backgroundColor: '#1E1E24', borderRadius: 12, padding: 16 }}>
            <svg ref={svgRef} viewBox="0 0 600 400" style={{ width: '100%', height: 'auto' }}>
              {edges.map((e, i) => { const s = nodes.find(n => n.id === e.source), t = nodes.find(n => n.id === e.target); if (!s || !t) return null; return <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="#4B5563" strokeWidth={e.strength * 2} strokeOpacity={0.6} />; })}
              {nodes.map(n => (
                <g key={n.id} onClick={() => setSelected(n)} style={{ cursor: 'pointer' }}>
                  <circle cx={n.x} cy={n.y} r={15} fill={eraColors[n.era] || '#6B7280'} stroke={selected?.id === n.id ? '#C9A227' : 'none'} strokeWidth={2} />
                  <text x={n.x} y={n.y - 20} textAnchor="middle" fill="#F5F4F2" fontSize="10">{n.name}</text>
                </g>
              ))}
            </svg>
          </div>
          <div style={{ width: 250, backgroundColor: '#1E1E24', borderRadius: 12, padding: 16 }}>
            {selected ? (<><h3 style={{ color: '#C9A227', marginBottom: 8 }}>{selected.name}</h3><p style={{ color: '#9CA3AF' }}>Era: <span style={{ color: eraColors[selected.era], textTransform: 'capitalize' }}>{selected.era?.replace('_', ' ')}</span></p></>) : (<p style={{ color: '#6B7280' }}>Click a node</p>)}
            <div style={{ marginTop: 24 }}><h4 style={{ color: '#6B7280', marginBottom: 8 }}>Legend</h4>{Object.entries(eraColors).map(([e, c]) => (<div key={e} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}><div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: c }} /><span style={{ fontSize: 12, textTransform: 'capitalize' }}>{e.replace('_', ' ')}</span></div>))}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
