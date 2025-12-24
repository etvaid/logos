'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  description: string;
  birth?: string;
  death?: string;
  works?: string[];
}

interface Edge {
  source: string;
  target: string;
  strength: number;
  type: 'influence' | 'reference' | 'response' | 'translation';
  description: string;
}

interface Transform {
  x: number;
  y: number;
  scale: number;
}

const AUTHORS: Node[] = [
  { 
    id: 'homer', 
    name: 'Homer', 
    type: 'author', 
    era: 'archaic', 
    language: 'greek', 
    x: 200, 
    y: 150, 
    radius: 40,
    description: 'Epic poet, author of the Iliad and Odyssey. Foundation of Western literature.',
    birth: '8th century BCE',
    death: '8th century BCE',
    works: ['Iliad', 'Odyssey']
  },
  { 
    id: 'hesiod', 
    name: 'Hesiod', 
    type: 'author', 
    era: 'archaic', 
    language: 'greek', 
    x: 350, 
    y: 100, 
    radius: 30,
    description: 'Didactic poet, author of Theogony and Works and Days.',
    birth: '750 BCE',
    death: '650 BCE',
    works: ['Theogony', 'Works and Days']
  },
  { 
    id: 'plato', 
    name: 'Plato', 
    type: 'author', 
    era: 'classical', 
    language: 'greek', 
    x: 300, 
    y: 250, 
    radius: 45,
    description: 'Philosopher, student of Socrates, teacher of Aristotle. Founded the Academy.',
    birth: '428 BCE',
    death: '348 BCE',
    works: ['Republic', 'Phaedrus', 'Symposium', 'Timaeus']
  },
  { 
    id: 'aristotle', 
    name: 'Aristotle', 
    type: 'author', 
    era: 'classical', 
    language: 'greek', 
    x: 450, 
    y: 220, 
    radius: 42,
    description: 'Philosopher and scientist. Student of Plato, tutor of Alexander the Great.',
    birth: '384 BCE',
    death: '322 BCE',
    works: ['Nicomachean Ethics', 'Politics', 'Poetics', 'Physics']
  },
  { 
    id: 'sophocles', 
    name: 'Sophocles', 
    type: 'author', 
    era: 'classical', 
    language: 'greek', 
    x: 150, 
    y: 280, 
    radius: 32,
    description: 'Tragic playwright, author of Oedipus Rex and Antigone.',
    birth: '496 BCE',
    death: '406 BCE',
    works: ['Oedipus Rex', 'Antigone', 'Electra']
  },
  { 
    id: 'virgil', 
    name: 'Virgil', 
    type: 'author', 
    era: 'imperial', 
    language: 'latin', 
    x: 250, 
    y: 400, 
    radius: 38,
    description: 'Roman poet, author of the Aeneid. Dante\'s guide in the Divine Comedy.',
    birth: '70 BCE',
    death: '19 BCE',
    works: ['Aeneid', 'Georgics', 'Eclogues']
  },
  { 
    id: 'cicero', 
    name: 'Cicero', 
    type: 'author', 
    era: 'imperial', 
    language: 'latin', 
    x: 420, 
    y: 350, 
    radius: 35,
    description: 'Roman orator, philosopher, and statesman. Master of Latin prose.',
    birth: '106 BCE',
    death: '43 BCE',
    works: ['De Oratore', 'De Re Publica', 'Philippics']
  },
  { 
    id: 'seneca', 
    name: 'Seneca', 
    type: 'author', 
    era: 'imperial', 
    language: 'latin', 
    x: 550, 
    y: 320, 
    radius: 30,
    description: 'Stoic philosopher and dramatist. Advisor to Emperor Nero.',
    birth: '4 BCE',
    death: '65 CE',
    works: ['Letters to Lucilius', 'Medea', 'Moral Essays']
  },
  { 
    id: 'augustine', 
    name: 'Augustine', 
    type: 'author', 
    era: 'lateAntique', 
    language: 'latin', 
    x: 480, 
    y: 450, 
    radius: 36,
    description: 'Christian theologian and philosopher. Author of Confessions and City of God.',
    birth: '354 CE',
    death: '430 CE',
    works: ['Confessions', 'City of God', 'On Christian Doctrine']
  },
  { 
    id: 'plotinus', 
    name: 'Plotinus', 
    type: 'author', 
    era: 'lateAntique', 
    language: 'greek', 
    x: 350, 
    y: 480, 
    radius: 28,
    description: 'Neoplatonist philosopher. Founded the school of Neoplatonism.',
    birth: '204 CE',
    death: '270 CE',
    works: ['Enneads']
  },
];

const CONNECTIONS: Edge[] = [
  { source: 'homer', target: 'plato', strength: 0.9, type: 'influence', description: 'Plato frequently quotes and references Homer, while also criticizing poets in the Republic.' },
  { source: 'homer', target: 'virgil', strength: 0.95, type: 'influence', description: 'The Aeneid is heavily modeled on the Homeric epics, particularly the Odyssey and Iliad.' },
  { source: 'homer', target: 'sophocles', strength: 0.8, type: 'influence', description: 'Sophocles draws on Homeric themes and characters in his tragic works.' },
  { source: 'hesiod', target: 'plato', strength: 0.6, type: 'influence', description: 'Plato references Hesiod\'s cosmogony and moral teachings.' },
  { source: 'plato', target: 'aristotle', strength: 0.95, type: 'response', description: 'Aristotle was Plato\'s student but developed his own philosophical system in response.' },
  { source: 'plato', target: 'cicero', strength: 0.85, type: 'translation', description: 'Cicero translated and adapted Platonic ideas for Roman audiences.' },
  { source: 'plato', target: 'plotinus', strength: 0.9, type: 'influence', description: 'Plotinus founded Neoplatonism based on Platonic metaphysics.' },
  { source: 'plato', target: 'augustine', strength: 0.8, type: 'influence', description: 'Augustine synthesized Platonic philosophy with Christian theology.' },
  { source: 'aristotle', target: 'cicero', strength: 0.7, type: 'translation', description: 'Cicero adapted Aristotelian rhetorical and ethical theories.' },
  { source: 'aristotle', target: 'seneca', strength: 0.5, type: 'influence', description: 'Seneca\'s Stoicism shows Aristotelian influence, particularly in ethics.' },
  { source: 'cicero', target: 'seneca', strength: 0.6, type: 'influence', description: 'Seneca admired Cicero\'s prose style and philosophical approach.' },
  { source: 'cicero', target: 'augustine', strength: 0.75, type: 'influence', description: 'Augustine incorporated Ciceronian rhetorical techniques and some philosophical ideas.' },
  { source: 'plotinus', target: 'augustine', strength: 0.85, type: 'influence', description: 'Augustine was heavily influenced by Plotinian Neoplatonism in his theological development.' },
];

export default function ConnectomePage() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'author' | 'work' | 'concept'>('all');
  const [filterLanguage, setFilterLanguage] = useState<'all' | 'greek' | 'latin'>('all');
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const getNodeColor = (node: Node, isHovered: boolean, isSelected: boolean) => {
    if (isSelected) return '#E8D5A3';
    if (isHovered) return '#C9A227';
    
    if (node.language === 'greek') return '#3B82F6';
    if (node.language === 'latin') return '#DC2626';
    return '#9CA3AF';
  };

  const getConnectionStrengthColor = (strength: number) => {
    if (strength >= 0.8) return '#C9A227';
    if (strength >= 0.6) return '#F59E0B';
    return '#9CA3AF';
  };

  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case 'influence': return '#3B82F6';
      case 'reference': return '#059669';
      case 'response': return '#DC2626';
      case 'translation': return '#7C3AED';
      default: return '#9CA3AF';
    }
  };

  const filteredNodes = AUTHORS.filter(node => {
    if (filterType !== 'all' && node.type !== filterType) return false;
    if (filterLanguage !== 'all' && node.language !== filterLanguage) return false;
    return true;
  });

  const getConnectedNodes = (nodeId: string) => {
    return CONNECTIONS.filter(conn => 
      conn.source === nodeId || conn.target === nodeId
    ).map(conn => conn.source === nodeId ? conn.target : conn.source);
  };

  const filteredConnections = CONNECTIONS.filter(conn => {
    const sourceNode = AUTHORS.find(n => n.id === conn.source);
    const targetNode = AUTHORS.find(n => n.id === conn.target);
    return filteredNodes.includes(sourceNode!) && filteredNodes.includes(targetNode!);
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale * delta))
    }));
  };

  const resetView = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#1E1E24', 
        borderBottom: '1px solid #141419',
        padding: '16px 0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '0 24px'
        }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none'
          }}>
            ΛΟΓΟΣ
          </Link>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <Link href="/reader" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>Reader</Link>
            <Link href="/library" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>Library</Link>
            <Link href="/connectome" style={{ color: '#C9A227', textDecoration: 'none' }}>Connectome</Link>
            <Link href="/timeline" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>Timeline</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div style={{ padding: '48px 24px 24px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          background: 'linear-gradient(45deg, #C9A227, #E8D5A3)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Literary Connectome
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#9CA3AF',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Explore the intricate web of influences, references, and connections between ancient authors and their works.
        </p>
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        padding: '0 24px 24px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Type:</span>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value as any)}
            style={{
              backgroundColor: '#1E1E24',
              color: '#F5F4F2',
              border: '1px solid #141419',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '14px'
            }}
          >
            <option value="all">All</option>
            <option value="author">Authors</option>
            <option value="work">Works</option>
            <option value="concept">Concepts</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Language:</span>
          <select 
            value={filterLanguage} 
            onChange={(e) => setFilterLanguage(e.target.value as any)}
            style={{
              backgroundColor: '#1E1E24',
              color: '#F5F4F2',
              border: '1px solid #141419',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '14px'
            }}
          >
            <option value="all">All</option>
            <option value="greek">Greek</option>
            <option value="latin">Latin</option>
          </select>
        </div>

        <button
          onClick={resetView}
          style={{
            backgroundColor: '#1E1E24',
            color: '#F5F4F2',
            border: '1px solid #141419',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#C9A227';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1E1E24';
          }}
        >
          Reset View
        </button>
      </div>

      {/* Main Content */}
      <div style={{ 
        display: 'flex',
        maxWidth: '1400px',
        margin: '0 auto',
        gap: '24px',
        padding: '0 24px',
        minHeight: '600px'
      }}>
        {/* Network Graph */}
        <div style={{ 
          flex: 1,
          backgroundColor: '#1E1E24',
          borderRadius: '16px',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            color: '#F5F4F2'
          }}>
            Network Graph
          </h2>

          <svg
            ref={svgRef}
            width="100%"
            height="500"
            style={{ 
              cursor: isDragging ? 'grabbing' : 'grab',
              backgroundColor: '#141419',
              borderRadius: '12px'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#9CA3AF"
                />
              </marker>
            </defs>

            <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
              {/* Connection Lines */}
              {filteredConnections.map((connection, index) => {
                const sourceNode = AUTHORS.find(n => n.id === connection.source);
                const targetNode = AUTHORS.find(n => n.id === connection.target);
                if (!sourceNode || !targetNode) return null;

                const isHighlighted = selectedNode && (
                  selectedNode.id === connection.source || 
                  selectedNode.id === connection.target
                );

                return (
                  <g key={`${connection.source}-${connection.target}-${index}`}>
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={isHighlighted ? getConnectionTypeColor(connection.type) : '#6B7280'}
                      strokeWidth={isHighlighted ? connection.strength * 4 : connection.strength * 2}
                      opacity={isHighlighted ? 0.9 : 0.4}
                      markerEnd="url(#arrowhead)"
                      style={{
                        transition: 'all 0.3s ease'
                      }}
                    />
                    {isHighlighted && (
                      <text
                        x={(sourceNode.x + targetNode.x) / 2}
                        y={(sourceNode.y + targetNode.y) / 2 - 8}
                        fill="#C9A227"
                        fontSize="12"
                        textAnchor="middle"
                        style={{ pointerEvents: 'none' }}
                      >
                        {connection.type}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isHovered = hoveredNode === node.id;
                const isConnected = selectedNode && getConnectedNodes(selectedNode.id).includes(node.id);
                
                return (
                  <g key={node.id}>
                    {/* Node glow effect for selected/hovered */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.radius + 8}
                        fill={getNodeColor(node, isHovered, isSelected)}
                        opacity={0.2}
                        style={{
                          transition: 'all 0.3s ease'
                        }}
                      />
                    )}

                    {/* Main node circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius}
                      fill={getNodeColor(node, isHovered, isSelected)}
                      stroke={isSelected ? '#E8D5A3' : isConnected ? '#C9A227' : 'transparent'}
                      strokeWidth={isSelected ? 3 : isConnected ? 2 : 0}
                      opacity={selectedNode && !isSelected && !isConnected ? 0.3 : 1}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => setSelectedNode(isSelected ? null : node)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                    />

                    {/* Node label */}
                    <text
                      x={node.x}
                      y={node.y + node.radius + 16}
                      fill={isSelected ? '#E8D5A3' : isConnected ? '#C9A227' : '#F5F4F2'}
                      fontSize={isSelected ? '14' : '12'}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      textAnchor="middle"
                      style={{ 
                        pointerEvents: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {node.name}
                    </text>

                    {/* Era indicator */}
                    <text
                      x={node.x}
                      y={node.y + node.radius + 32}
                      fill="#6B7280"
                      fontSize="10"
                      textAnchor="middle"
                      style={{ pointerEvents: 'none' }}
                    >
                      {node.era}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Zoom indicator */}
          <div style={{
            position: 'absolute',
            top: '70px',
            right: '32px',
            backgroundColor: '#141419',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#9CA3AF'
          }}>
            Zoom: {Math.round(transform.scale * 100)}%
          </div>
        </div>

        {/* Info Panel */}
        <div style={{ 
          width: '350px',
          backgroundColor: '#1E1E24',
          borderRadius: '16px',
          padding: '24px',
          height: 'fit-content'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            color: '#F5F4F2'
          }}>
            {selectedNode ? 'Author Details' : 'Instructions'}
          </h2>

          {selectedNode ? (
            <div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold',
                color: selectedNode.language === 'greek' ? '#3B82F6' : '#DC2626',
                marginBottom: '16px'
              }}>
                {selectedNode.name}
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  marginBottom: '12px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ 
                    backgroundColor: '#141419',
                    color: '#C9A227',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}>
                    {selectedNode.type}
                  </span>
                  <span style={{ 
                    backgroundColor: '#141419',
                    color: selectedNode.language === 'greek' ? '#3B82F6' : '#DC2626',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}>
                    {selectedNode.language}
                  </span>
                  <span style={{ 
                    backgroundColor: '#141419',
                    color: '#F59E0B',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}>
                    {selectedNode.era}
                  </span>
                </div>

                {selectedNode.birth && (
                  <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '8px' }}>
                    <strong>Life:</strong> {selectedNode.birth} - {selectedNode.death}
                  </p>
                )}

                <p style={{ fontSize: '14px', color: '#F5F4F2', lineHeight: 1.5, marginBottom: '16px' }}>
                  {selectedNode.description}
                </p>

                {selectedNode.works && selectedNode.works.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#C9A227' }}>
                      Major Works:
                    </h4>
                    <ul style={{ 
                      listStyle: 'none', 
                      padding: 0,
                      margin: 0
                    }}>
                      {selectedNode.works.map((work, index) => (
                        <li key={index} style={{ 
                          fontSize: '14px',
                          color: '#9CA3AF',
                          marginBottom: '4px',
                          paddingLeft: '16px',
                          position: 'relative'
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: '0',
                            color: '#C9A227'
                          }}>•</span>
                          {work}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Connections */}
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#C9A227' }}>
                  Connections:
                </h4>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {CONNECTIONS
                    .filter(conn => conn.source === selectedNode.id || conn.target === selectedNode.id)
                    .map((conn, index) => {
                      const otherNodeId = conn.source === selectedNode.id ? conn.target : conn.source;
                      const otherNode = AUTHORS.find(n => n.id === otherNodeId);
                      if (!otherNode) return null;

                      return (
                        <div key={index} style={{ 
                          marginBottom: '12px',
                          padding: '12px',
                          backgroundColor: '#141419',
                          borderRadius: '8px',
                          border: `2px solid ${getConnectionTypeColor(conn.type)}`
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                          }}>
                            <span style={{ 
                              fontSize: '14px',
                              fontWeight: 'bold',
                              color: '#F5F4F2'
                            }}>
                              {otherNode.name}
                            </span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              {Array.from({ length: Math.round(conn.strength * 5) }).map((_, i) => (
                                <div key={i} style={{
                                  width: '4px',
                                  height: '4px',
                                  backgroundColor: '#C9A227',
                                  borderRadius: '50%'
                                }} />
                              ))}
                            </div>
                          </div>
                          <div style={{ 
                            fontSize: '12px',
                            color: getConnectionTypeColor(conn.type),
                            fontWeight: 'bold',