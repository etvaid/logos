
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Node {
  id: string;
  name: string;
  type: 'author' | 'work' | 'concept';
  era: string;
  language: 'greek' | 'latin';
  x: number;
  y: number;
  radius: number;
}

interface Edge {
  source: string;
  target: string;
  strength: number;
  type: 'influence' | 'reference' | 'response' | 'translation';
}

const AUTHORS: Node[] = [
  { id: 'homer', name: 'Homer', type: 'author', era: 'archaic', language: 'greek', x: 200, y: 150, radius: 40 },
  { id: 'hesiod', name: 'Hesiod', type: 'author', era: 'archaic', language: 'greek', x: 350, y: 100, radius: 30 },
  { id: 'plato', name: 'Plato', type: 'author', era: 'classical', language: 'greek', x: 300, y: 250, radius: 45 },
  { id: 'aristotle', name: 'Aristotle', type: 'author', era: 'classical', language: 'greek', x: 450, y: 220, radius: 42 },
  { id: 'sophocles', name: 'Sophocles', type: 'author', era: 'classical', language: 'greek', x: 150, y: 280, radius: 32 },
  { id: 'virgil', name: 'Virgil', type: 'author', era: 'imperial', language: 'latin', x: 250, y: 400, radius: 38 },
  { id: 'cicero', name: 'Cicero', type: 'author', era: 'imperial', language: 'latin', x: 420, y: 350, radius: 35 },
  { id: 'seneca', name: 'Seneca', type: 'author', era: 'imperial', language: 'latin', x: 550, y: 320, radius: 30 },
  { id: 'augustine', name: 'Augustine', type: 'author', era: 'lateAntique', language: 'latin', x: 480, y: 450, radius: 36 },
  { id: 'plotinus', name: 'Plotinus', type: 'author', era: 'lateAntique', language: 'greek', x: 350, y: 480, radius: 28 },
];

const CONNECTIONS: Edge[] = [
  { source: 'homer', target: 'plato', strength: 0.9, type: 'influence' },
  { source: 'homer', target: 'virgil', strength: 0.95, type: 'influence' },
  { source: 'homer', target: 'sophocles', strength: 0.8, type: 'influence' },
  { source: 'hesiod', target: 'plato', strength: 0.6, type: 'influence' },
  { source: 'plato', target: 'aristotle', strength: 0.95, type: 'response' },
  { source: 'plato', target: 'cicero', strength: 0.85, type: 'translation' },
  { source: 'plato', target: 'plotinus', strength: 0.9, type: 'influence' },
  { source: 'plato', target: 'augustine', strength: 0.8, type: 'influence' },
  { source: 'aristotle', target: 'cicero', strength: 0.7, type: 'translation' },
  { source: 'aristotle', target: 'seneca', strength: 0.5, type: 'influence' },
  { source: 'cicero', target: 'seneca', strength: 0.6, type: 'influence' },
  { source: 'cicero', target: 'augustine', strength: 0.75, type: 'influence' },
  { source: 'virgil', target: 'augustine', strength: 0.4, type: 'reference' },
  { source: 'plotinus', target: 'augustine', strength: 0.85, type: 'influence' },
  { source: 'seneca', target: 'augustine', strength: 0.3, type: 'influence' },
];

const ERA_COLORS: Record<string, string> = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  lateAntique: '#7C3AED',
};

const EDGE_COLORS: Record<string, string> = {
  influence: '#C9A227',
  reference: '#3B82F6',
  response: '#10B981',
  translation: '#EC4899',
};

export default function ConnectomePage() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<Edge | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const getNode = (id: string) => AUTHORS.find(a => a.id === id);

  const filteredConnections = filter === 'all' 
    ? CONNECTIONS 
    : CONNECTIONS.filter(c => c.type === filter);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <nav style={{ borderBottom: '1px solid #2D2D35', padding: '16px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>LOGOS</Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/search" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Search</Link>
            <Link href="/connectome" style={{ color: '#C9A227', textDecoration: 'none' }}>Connectome</Link>
            <Link href="/semantia" style={{ color: '#9CA3AF', textDecoration: 'none' }}>SEMANTIA</Link>
            <Link href="/maps" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Maps</Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#C9A227', marginBottom: '8px' }}>Literary Connectome</h1>
          <p style={{ color: '#9CA3AF' }}>Visualize influence networks across 1,500 years of classical literature</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['all', 'influence', 'reference', 'response', 'translation'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '10px 20px',
                backgroundColor: filter === f ? '#C9A227' : '#1E1E24',
                color: filter === f ? '#0D0D0F' : '#F5F4F2',
                border: '1px solid #2D2D35',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: filter === f ? 'bold' : 'normal',
                textTransform: 'capitalize',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Graph */}
          <div style={{ flex: 1, backgroundColor: '#1E1E24', borderRadius: '16px', padding: '16px', border: '1px solid #2D2D35' }}>
            <svg viewBox="0 0 700 550" style={{ width: '100%', height: '500px' }}>
              {/* Edges */}
              {filteredConnections.map((edge, i) => {
                const source = getNode(edge.source);
                const target = getNode(edge.target);
                if (!source || !target) return null;
                
                const isHovered = hoveredEdge === edge;
                
                return (
                  <g key={i}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={EDGE_COLORS[edge.type]}
                      strokeWidth={edge.strength * (isHovered ? 6 : 4)}
                      strokeOpacity={isHovered ? 1 : 0.4}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={() => setHoveredEdge(edge)}
                      onMouseLeave={() => setHoveredEdge(null)}
                    />
                    {/* Arrow */}
                    <polygon
                      points={`${target.x},${target.y - target.radius - 5} ${target.x - 5},${target.y - target.radius - 12} ${target.x + 5},${target.y - target.radius - 12}`}
                      fill={EDGE_COLORS[edge.type]}
                      opacity={isHovered ? 1 : 0.4}
                      style={{ transition: 'all 0.2s' }}
                    />
                  </g>
                );
              })}

              {/* Nodes */}
              {AUTHORS.map(node => {
                const isSelected = selectedNode?.id === node.id;
                const hasConnection = filteredConnections.some(c => c.source === node.id || c.target === node.id);
                
                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(isSelected ? null : node)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Glow effect */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.radius + 10}
                        fill="none"
                        stroke="#C9A227"
                        strokeWidth="2"
                        opacity="0.5"
                      />
                    )}
                    {/* Node circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius}
                      fill={ERA_COLORS[node.era]}
                      stroke={node.language === 'greek' ? '#3B82F6' : '#DC2626'}
                      strokeWidth="3"
                      opacity={hasConnection || filter === 'all' ? 1 : 0.3}
                      style={{ transition: 'all 0.3s' }}
                    />
                    {/* Language indicator */}
                    <text
                      x={node.x}
                      y={node.y - 5}
                      textAnchor="middle"
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                    >
                      {node.language === 'greek' ? 'Α' : 'L'}
                    </text>
                    {/* Name */}
                    <text
                      x={node.x}
                      y={node.y + 12}
                      textAnchor="middle"
                      fill="white"
                      fontSize="11"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Info Panel */}
          <div style={{ width: '300px' }}>
            {/* Legend */}
            <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '20px', marginBottom: '16px', border: '1px solid #2D2D35' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '16px', color: '#C9A227' }}>Connection Types</h3>
              {Object.entries(EDGE_COLORS).map(([type, color]) => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ width: '24px', height: '4px', backgroundColor: color, borderRadius: '2px' }}></div>
                  <span style={{ textTransform: 'capitalize', fontSize: '14px' }}>{type}</span>
                </div>
              ))}
            </div>

            {/* Era Legend */}
            <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '20px', marginBottom: '16px', border: '1px solid #2D2D35' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '16px', color: '#C9A227' }}>Eras</h3>
              {Object.entries(ERA_COLORS).map(([era, color]) => (
                <div key={era} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: color, borderRadius: '50%' }}></div>
                  <span style={{ textTransform: 'capitalize', fontSize: '14px' }}>{era}</span>
                </div>
              ))}
            </div>

            {/* Selected Node Info */}
            {selectedNode && (
              <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '20px', border: `2px solid ${ERA_COLORS[selectedNode.era]}` }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{selectedNode.name}</h3>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: ERA_COLORS[selectedNode.era], borderRadius: '4px', fontSize: '12px', textTransform: 'capitalize' }}>{selectedNode.era}</span>
                  <span style={{ padding: '4px 12px', backgroundColor: selectedNode.language === 'greek' ? '#3B82F6' : '#DC2626', borderRadius: '4px', fontSize: '12px' }}>{selectedNode.language}</span>
                </div>
                <h4 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#9CA3AF' }}>Connections</h4>
                {CONNECTIONS.filter(c => c.source === selectedNode.id || c.target === selectedNode.id).map((c, i) => {
                  const other = c.source === selectedNode.id ? getNode(c.target) : getNode(c.source);
                  const direction = c.source === selectedNode.id ? '→' : '←';
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px' }}>
                      <span>{direction}</span>
                      <span style={{ color: '#F5F4F2' }}>{other?.name}</span>
                      <span style={{ color: EDGE_COLORS[c.type], fontSize: '12px' }}>({c.type})</span>
                      <span style={{ marginLeft: 'auto', color: '#C9A227' }}>{Math.round(c.strength * 100)}%</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Hovered Edge Info */}
            {hoveredEdge && !selectedNode && (
              <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '20px', border: `2px solid ${EDGE_COLORS[hoveredEdge.type]}` }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
                  {getNode(hoveredEdge.source)?.name} → {getNode(hoveredEdge.target)?.name}
                </h3>
                <p style={{ color: '#9CA3AF', marginBottom: '8px', textTransform: 'capitalize' }}>Type: {hoveredEdge.type}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#9CA3AF' }}>Strength:</span>
                  <div style={{ flex: 1, height: '8px', backgroundColor: '#0D0D0F', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${hoveredEdge.strength * 100}%`, height: '100%', backgroundColor: '#C9A227' }}></div>
                  </div>
                  <span style={{ color: '#C9A227' }}>{Math.round(hoveredEdge.strength * 100)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
