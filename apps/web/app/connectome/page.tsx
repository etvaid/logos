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
  { source: 'cicero', target: 'augustine', strength: 0.75, type: 'influence', description: 'Augustine was deeply influenced by Cicero\'s Hortensius.' },
];

const Connectome = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [filters, setFilters] = useState({
    language: 'all' as 'all' | 'greek' | 'latin',
    era: 'all' as string,
    connectionType: 'all' as 'all' | 'influence' | 'reference' | 'response' | 'translation'
  });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement>(null);

  const getEraColor = (era: string) => {
    switch (era) {
      case 'archaic': return '#D97706';
      case 'classical': return '#F59E0B';
      case 'hellenistic': return '#3B82F6';
      case 'imperial': return '#DC2626';
      case 'lateAntique': return '#7C3AED';
      case 'byzantine': return '#059669';
      default: return '#C9A227';
    }
  };

  const getLanguageColor = (language: 'greek' | 'latin') => {
    return language === 'greek' ? '#3B82F6' : '#DC2626';
  };

  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case 'influence': return '#C9A227';
      case 'reference': return '#3B82F6';
      case 'response': return '#DC2626';
      case 'translation': return '#7C3AED';
      default: return '#9CA3AF';
    }
  };

  const filteredAuthors = AUTHORS.filter(author => {
    if (filters.language !== 'all' && author.language !== filters.language) return false;
    if (filters.era !== 'all' && author.era !== filters.era) return false;
    return true;
  });

  const filteredConnections = CONNECTIONS.filter(connection => {
    if (filters.connectionType !== 'all' && connection.type !== filters.connectionType) return false;
    const sourceExists = filteredAuthors.some(a => a.id === connection.source);
    const targetExists = filteredAuthors.some(a => a.id === connection.target);
    return sourceExists && targetExists;
  });

  const getRelatedConnections = (nodeId: string) => {
    return filteredConnections.filter(conn => 
      conn.source === nodeId || conn.target === nodeId
    );
  };

  const handleNodeClick = (node: Node) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node);
    setSelectedEdge(null);
  };

  const handleEdgeClick = (edge: Edge) => {
    setSelectedEdge(selectedEdge === edge ? null : edge);
    setSelectedNode(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.1, transform.scale + delta), 3);
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#1E1E24', 
        padding: '16px 24px', 
        borderBottom: '1px solid #141419' 
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none' 
          }}>
            LOGOS
          </Link>
          <div style={{ display: 'flex', gap: '32px' }}>
            <Link href="/reader" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Reader</Link>
            <Link href="/lexicon" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Lexicon</Link>
            <Link href="/timeline" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Timeline</Link>
            <Link href="/connectome" style={{ color: '#C9A227', textDecoration: 'none' }}>Connectome</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div style={{ padding: '48px 24px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          color: '#F5F4F2', 
          marginBottom: '16px' 
        }}>
          Literary Connectome
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#9CA3AF', 
          lineHeight: '1.6' 
        }}>
          Explore the intricate web of influences, references, and relationships between classical authors and their works.
        </p>
      </div>

      {/* Main Content */}
      <div style={{ 
        display: 'flex', 
        gap: '24px', 
        padding: '0 24px 48px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Filters Panel */}
        <div style={{ 
          width: '280px',
          backgroundColor: '#1E1E24',
          padding: '24px',
          borderRadius: '12px',
          height: 'fit-content'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: '#F5F4F2', 
            marginBottom: '24px' 
          }}>
            Filters
          </h3>
          
          {/* Language Filter */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#9CA3AF', 
              marginBottom: '8px' 
            }}>
              Language
            </label>
            <select
              value={filters.language}
              onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value as any }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#141419',
                border: '1px solid #6B7280',
                borderRadius: '8px',
                color: '#F5F4F2',
                fontSize: '14px'
              }}
            >
              <option value="all">All Languages</option>
              <option value="greek">Greek</option>
              <option value="latin">Latin</option>
            </select>
          </div>

          {/* Era Filter */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#9CA3AF', 
              marginBottom: '8px' 
            }}>
              Era
            </label>
            <select
              value={filters.era}
              onChange={(e) => setFilters(prev => ({ ...prev, era: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#141419',
                border: '1px solid #6B7280',
                borderRadius: '8px',
                color: '#F5F4F2',
                fontSize: '14px'
              }}
            >
              <option value="all">All Eras</option>
              <option value="archaic">Archaic (800-500 BCE)</option>
              <option value="classical">Classical (500-323 BCE)</option>
              <option value="imperial">Imperial (31 BCE-284 CE)</option>
              <option value="lateAntique">Late Antique (284-600 CE)</option>
            </select>
          </div>

          {/* Connection Type Filter */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#9CA3AF', 
              marginBottom: '8px' 
            }}>
              Connection Type
            </label>
            <select
              value={filters.connectionType}
              onChange={(e) => setFilters(prev => ({ ...prev, connectionType: e.target.value as any }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#141419',
                border: '1px solid #6B7280',
                borderRadius: '8px',
                color: '#F5F4F2',
                fontSize: '14px'
              }}
            >
              <option value="all">All Connections</option>
              <option value="influence">Influence</option>
              <option value="reference">Reference</option>
              <option value="response">Response</option>
              <option value="translation">Translation</option>
            </select>
          </div>

          {/* Legend */}
          <div>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              color: '#F5F4F2', 
              marginBottom: '16px' 
            }}>
              Legend
            </h4>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#9CA3AF', 
                marginBottom: '8px' 
              }}>
                Languages
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  backgroundColor: '#3B82F6' 
                }}></div>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Greek</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  backgroundColor: '#DC2626' 
                }}></div>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Latin</span>
              </div>
            </div>

            <div>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#9CA3AF', 
                marginBottom: '8px' 
              }}>
                Connection Types
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ 
                  width: '20px', 
                  height: '2px', 
                  backgroundColor: '#C9A227' 
                }}></div>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Influence</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ 
                  width: '20px', 
                  height: '2px', 
                  backgroundColor: '#3B82F6' 
                }}></div>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Reference</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ 
                  width: '20px', 
                  height: '2px', 
                  backgroundColor: '#DC2626' 
                }}></div>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Response</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '20px', 
                  height: '2px', 
                  backgroundColor: '#7C3AED' 
                }}></div>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Translation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Graph Container */}
        <div style={{ 
          flex: 1,
          backgroundColor: '#1E1E24',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{ 
            padding: '16px 20px', 
            borderBottom: '1px solid #141419',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#F5F4F2' 
            }}>
              Network Graph
            </h3>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              Click and drag to pan • Scroll to zoom
            </div>
          </div>

          <svg
            ref={svgRef}
            width="100%"
            height="600"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            onMouseDown={handleMouseDown}
            onWheel={handleWheel}
          >
            <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
              {/* Render connections first (behind nodes) */}
              {filteredConnections.map((connection, index) => {
                const sourceNode = filteredAuthors.find(a => a.id === connection.source);
                const targetNode = filteredAuthors.find(a => a.id === connection.target);
                
                if (!sourceNode || !targetNode) return null;

                const isHighlighted = selectedNode && 
                  (selectedNode.id === connection.source || selectedNode.id === connection.target);
                const isSelected = selectedEdge === connection;
                const strokeWidth = connection.strength * 4 + 1;
                const opacity = selectedNode ? (isHighlighted ? 0.9 : 0.2) : 0.6;

                return (
                  <line
                    key={`${connection.source}-${connection.target}-${index}`}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={getConnectionTypeColor(connection.type)}
                    strokeWidth={isSelected ? strokeWidth + 2 : strokeWidth}
                    opacity={opacity}
                    style={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdgeClick(connection);
                    }}
                  />
                );
              })}

              {/* Render nodes */}
              {filteredAuthors.map((node) => {
                const relatedConnections = getRelatedConnections(node.id);
                const isSelected = selectedNode?.id === node.id;
                const isHovered = hoveredNode === node.id;
                const isConnectedToSelected = selectedNode && 
                  relatedConnections.some(conn => 
                    conn.source === selectedNode.id || conn.target === selectedNode.id
                  );
                
                const opacity = selectedNode ? 
                  (isSelected || isConnectedToSelected ? 1 : 0.3) : 1;
                const scale = isSelected || isHovered ? 1.2 : 1;

                return (
                  <g key={node.id}>
                    {/* Node circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius}
                      fill={getLanguageColor(node.language)}
                      stroke={isSelected ? '#C9A227' : getEraColor(node.era)}
                      strokeWidth={isSelected ? 4 : 2}
                      opacity={opacity}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: `scale(${scale})`,
                        transformOrigin: `${node.x}px ${node.y}px`
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNodeClick(node);
                      }}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                    />
                    
                    {/* Node label */}
                    <text
                      x={node.x}
                      y={node.y + node.radius + 16}
                      textAnchor="middle"
                      fill="#F5F4F2"
                      fontSize="12"
                      fontWeight="500"
                      opacity={opacity}
                      style={{
                        pointerEvents: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Info Panel */}
        <div style={{ 
          width: '320px',
          backgroundColor: '#1E1E24',
          padding: '24px',
          borderRadius: '12px',
          height: 'fit-content',
          maxHeight: '600px',
          overflowY: 'auto'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: '#F5F4F2', 
            marginBottom: '24px' 
          }}>
            Details
          </h3>
          
          {selectedNode ? (
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '16px' 
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: getLanguageColor(selectedNode.language)
                }}></div>
                <h4 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  color: '#F5F4F2' 
                }}>
                  {selectedNode.name}
                </h4>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#6B7280', 
                  marginBottom: '4px' 
                }}>
                  ERA
                </div>
                <div style={{ 
                  display: 'inline-block',
                  padding: '4px 8px',
                  backgroundColor: getEraColor(selectedNode.era),
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#F5F4F2',
                  textTransform: 'capitalize'
                }}>
                  {selectedNode.era}
                </div>
              </div>

              {selectedNode.birth && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6B7280', 
                    marginBottom: '4px' 
                  }}>
                    DATES
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#9CA3AF' 
                  }}>
                    {selectedNode.birth} - {selectedNode.death}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <div style={{ 