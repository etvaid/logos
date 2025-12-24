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
  concepts?: string[];
  connections?: string[];
}

interface Edge {
  source: string;
  target: string;
  strength: number;
  type: 'influence' | 'reference' | 'response' | 'translation' | 'conceptual';
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
    name: 'Ὅμηρος (Homer)', 
    type: 'author', 
    era: 'archaic', 
    language: 'greek', 
    x: 200, 
    y: 150, 
    radius: 40,
    description: 'Epic poet, author of the Iliad and Odyssey. Foundation of Western literature with formulaic composition and oral tradition.',
    birth: 'c. 8th century BCE',
    death: 'c. 8th century BCE',
    works: ['Ἰλιάς (Iliad)', 'Ὀδύσσεια (Odyssey)'],
    connections: ['virgil', 'heroic-code', 'epic-tradition']
  },
  { 
    id: 'hesiod', 
    name: 'Ἡσίοδος (Hesiod)', 
    type: 'author', 
    era: 'archaic', 
    language: 'greek', 
    x: 350, 
    y: 100, 
    radius: 30,
    description: 'Didactic poet introducing systematic theology and moral instruction. Pioneer of the Works and Days tradition.',
    birth: 'c. 750 BCE',
    death: 'c. 650 BCE',
    works: ['Θεογονία (Theogony)', 'Ἔργα καὶ Ἡμέραι (Works and Days)'],
    connections: ['virgil', 'divine-order']
  },
  { 
    id: 'plato', 
    name: 'Πλάτων (Plato)', 
    type: 'author', 
    era: 'classical', 
    language: 'greek', 
    x: 300, 
    y: 250, 
    radius: 45,
    description: 'Philosopher establishing the Academy. Developer of the Theory of Forms and dialectical method through dramatic dialogues.',
    birth: '428/427 BCE',
    death: '348/347 BCE',
    works: ['Πολιτεία (Republic)', 'Φαῖδρος (Phaedrus)', 'Συμπόσιον (Symposium)', 'Τίμαιος (Timaeus)'],
    connections: ['aristotle', 'cicero', 'idealism', 'philosophy']
  },
  { 
    id: 'aristotle', 
    name: 'Ἀριστοτέλης (Aristotle)', 
    type: 'author', 
    era: 'classical', 
    language: 'greek', 
    x: 450, 
    y: 220, 
    radius: 42,
    description: 'Peripatetic philosopher founding the Lyceum. Systematizer of logic, ethics, politics, and natural philosophy.',
    birth: '384 BCE',
    death: '322 BCE',
    works: ['Ἠθικὰ Νικομάχεια (Nicomachean Ethics)', 'Πολιτικά (Politics)', 'Ποιητική (Poetics)', 'Φυσική (Physics)'],
    connections: ['plato', 'cicero', 'seneca', 'philosophy', 'ethics']
  },
  { 
    id: 'sophocles', 
    name: 'Σοφοκλῆς (Sophocles)', 
    type: 'author', 
    era: 'classical', 
    language: 'greek', 
    x: 150, 
    y: 280, 
    radius: 32,
    description: 'Tragic playwright perfecting the dramatic trilogy. Master of tragic irony and character development in Attic drama.',
    birth: 'c. 496 BCE',
    death: '406 BCE',
    works: ['Οἰδίπους Τύραννος (Oedipus Rex)', 'Ἀντιγόνη (Antigone)', 'Ἠλέκτρα (Electra)'],
    connections: ['seneca', 'tragic-form', 'fate-fortune']
  },
  { 
    id: 'virgil', 
    name: 'P. Vergilius Maro', 
    type: 'author', 
    era: 'imperial', 
    language: 'latin', 
    x: 250, 
    y: 400, 
    radius: 38,
    description: 'Augustan poet creating the Roman national epic. Master of literary allusion and Golden Age Latin hexameter.',
    birth: '70 BCE',
    death: '19 BCE',
    works: ['Aeneis', 'Georgica', 'Bucolica'],
    connections: ['homer', 'hesiod', 'epic-tradition']
  },
  { 
    id: 'cicero', 
    name: 'M. Tullius Cicero', 
    type: 'author', 
    era: 'imperial', 
    language: 'latin', 
    x: 420, 
    y: 350, 
    radius: 35,
    description: 'Consul and orator establishing the periodic sentence. Transmitter of Greek philosophy to Roman intellectual culture.',
    birth: '106 BCE',
    death: '43 BCE',
    works: ['De Oratore', 'De Re Publica', 'Philippicae', 'De Officiis'],
    connections: ['plato', 'aristotle', 'philosophy', 'rhetoric']
  },
  { 
    id: 'seneca', 
    name: 'L. Annaeus Seneca', 
    type: 'author', 
    era: 'imperial', 
    language: 'latin', 
    x: 550, 
    y: 320, 
    radius: 30,
    description: 'Stoic philosopher and tragedian. Developer of the sententious style and Roman Stoic ethics.',
    birth: 'c. 4 BCE',
    death: '65 CE',
    works: ['Epistulae Morales', 'De Ira', 'Medea', 'Phaedra'],
    connections: ['aristotle', 'sophocles', 'stoicism', 'ethics']
  }
];

const CONCEPTS: Node[] = [
  {
    id: 'epic-tradition',
    name: 'Epic Tradition',
    type: 'concept',
    era: 'archaic',
    language: 'greek',
    x: 100,
    y: 200,
    radius: 25,
    description: 'Oral formulaic composition tradition establishing heroic narrative patterns and epithetic language.',
    connections: ['homer', 'virgil']
  },
  {
    id: 'heroic-code',
    name: 'Heroic Code',
    type: 'concept',
    era: 'archaic', 
    language: 'greek',
    x: 180,
    y: 80,
    radius: 22,
    description: 'Aristocratic value system emphasizing τιμή (honor), κλέος (glory), and ἀρετή (excellence).',
    connections: ['homer', 'sophocles']
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    type: 'concept',
    era: 'classical',
    language: 'greek', 
    x: 380,
    y: 180,
    radius: 35,
    description: 'Systematic inquiry into reality, knowledge, and ethics through dialectical reasoning.',
    connections: ['plato', 'aristotle', 'cicero']
  },
  {
    id: 'stoicism',
    name: 'Stoicism',
    type: 'concept',
    era: 'hellenistic',
    language: 'greek',
    x: 500,
    y: 400,
    radius: 28,
    description: 'Philosophical school emphasizing virtue, cosmic sympathy, and emotional self-control.',
    connections: ['seneca', 'cicero']
  },
  {
    id: 'rhetoric',
    name: 'Rhetoric',
    type: 'concept',
    era: 'classical',
    language: 'greek',
    x: 320,
    y: 350,
    radius: 24,
    description: 'Art of persuasion through structured argumentation and stylistic devices.',
    connections: ['cicero', 'philosophy']
  },
  {
    id: 'ethics',
    name: 'Ethics',
    type: 'concept',
    era: 'classical',
    language: 'greek',
    x: 480,
    y: 280,
    radius: 26,
    description: 'Systematic study of moral principles and virtuous action.',
    connections: ['aristotle', 'seneca', 'stoicism']
  },
  {
    id: 'tragic-form',
    name: 'Tragic Form',
    type: 'concept',
    era: 'classical',
    language: 'greek',
    x: 80,
    y: 320,
    radius: 23,
    description: 'Dramatic structure exploring hubris, hamartia, and cathartic resolution.',
    connections: ['sophocles', 'seneca']
  },
  {
    id: 'divine-order',
    name: 'Divine Order',
    type: 'concept',
    era: 'archaic',
    language: 'greek',
    x: 420,
    y: 120,
    radius: 20,
    description: 'Cosmic hierarchy and theological systematization of divine powers.',
    connections: ['hesiod', 'plato']
  }
];

const EDGES: Edge[] = [
  { source: 'homer', target: 'virgil', strength: 0.9, type: 'influence', description: 'Virgil models the Aeneid on Homeric epic structure' },
  { source: 'homer', target: 'epic-tradition', strength: 0.95, type: 'conceptual', description: 'Homer establishes the epic tradition' },
  { source: 'plato', target: 'aristotle', strength: 0.85, type: 'influence', description: 'Aristotle studies under Plato but develops opposing theories' },
  { source: 'plato', target: 'cicero', strength: 0.7, type: 'influence', description: 'Cicero transmits Platonic philosophy to Rome' },
  { source: 'aristotle', target: 'seneca', strength: 0.6, type: 'influence', description: 'Seneca adapts Aristotelian ethics to Stoicism' },
  { source: 'sophocles', target: 'seneca', strength: 0.8, type: 'influence', description: 'Seneca adapts Sophoclean tragedies for Roman stage' },
  { source: 'philosophy', target: 'plato', strength: 0.9, type: 'conceptual', description: 'Plato systematizes philosophical method' },
  { source: 'philosophy', target: 'aristotle', strength: 0.9, type: 'conceptual', description: 'Aristotle creates systematic philosophy' },
  { source: 'stoicism', target: 'seneca', strength: 0.85, type: 'conceptual', description: 'Seneca develops Roman Stoic practice' },
  { source: 'heroic-code', target: 'homer', strength: 0.8, type: 'conceptual', description: 'Homeric epics embody heroic values' },
  { source: 'rhetoric', target: 'cicero', strength: 0.9, type: 'conceptual', description: 'Cicero masters and theorizes rhetoric' }
];

const ERA_COLORS = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  'late-antique': '#7C3AED',
  byzantine: '#059669'
};

const ALL_NODES = [...AUTHORS, ...CONCEPTS];

export default function ClassicalNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [animatedConnections, setAnimatedConnections] = useState<Set<string>>(new Set());

  const getNodeConnections = useCallback((nodeId: string) => {
    return EDGES.filter(edge => edge.source === nodeId || edge.target === nodeId);
  }, []);

  const getConnectedNodeIds = useCallback((nodeId: string) => {
    const connections = getNodeConnections(nodeId);
    return connections.map(edge => edge.source === nodeId ? edge.target : edge.source);
  }, [getNodeConnections]);

  const handleNodeClick = useCallback((node: Node) => {
    setSelectedNode(node);
    const connectedIds = getConnectedNodeIds(node.id);
    const connectionSet = new Set([node.id, ...connectedIds]);
    setAnimatedConnections(connectionSet);
  }, [getConnectedNodeIds]);

  const handleNodeHover = useCallback((node: Node | null) => {
    setHoveredNode(node);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
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

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.3, Math.min(3, prev.scale * delta))
    }));
  }, []);

  const isNodeHighlighted = useCallback((nodeId: string) => {
    if (!selectedNode && !hoveredNode) return true;
    const targetNode = selectedNode || hoveredNode;
    if (!targetNode) return true;
    
    return nodeId === targetNode.id || getConnectedNodeIds(targetNode.id).includes(nodeId);
  }, [selectedNode, hoveredNode, getConnectedNodeIds]);

  const isEdgeHighlighted = useCallback((edge: Edge) => {
    if (!selectedNode && !hoveredNode) return false;
    const targetNode = selectedNode || hoveredNode;
    if (!targetNode) return false;
    
    return edge.source === targetNode.id || edge.target === targetNode.id;
  }, [selectedNode, hoveredNode]);

  const renderNode = useCallback((node: Node) => {
    const highlighted = isNodeHighlighted(node.id);
    const isSelected = selectedNode?.id === node.id;
    const isHovered = hoveredNode?.id === node.id;
    const isAnimated = animatedConnections.has(node.id);
    
    const baseColor = ERA_COLORS[node.era as keyof typeof ERA_COLORS];
    const opacity = highlighted ? 1 : 0.3;
    const scale = isSelected ? 1.3 : isHovered ? 1.15 : 1;
    const strokeWidth = isSelected ? 4 : isHovered ? 3 : 2;

    return (
      <g key={node.id}>
        {/* Pulsing animation for connected nodes */}
        {isAnimated && !isSelected && (
          <circle
            cx={node.x}
            cy={node.y}
            r={node.radius + 10}
            fill="none"
            stroke={baseColor}
            strokeWidth="2"
            opacity="0.6"
            style={{
              animation: 'pulse 2s infinite',
              transformOrigin: `${node.x}px ${node.y}px`
            }}
          />
        )}
        
        {/* Main node circle */}
        <circle
          cx={node.x}
          cy={node.y}
          r={node.radius}
          fill={`${baseColor}${highlighted ? 'CC' : '66'}`}
          stroke={baseColor}
          strokeWidth={strokeWidth}
          opacity={opacity}
          style={{
            cursor: 'pointer',
            transform: `scale(${scale})`,
            transformOrigin: `${node.x}px ${node.y}px`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: isSelected ? 'drop-shadow(0 0 20px rgba(201, 162, 39, 0.6))' : 'none'
          }}
          onClick={() => handleNodeClick(node)}
          onMouseEnter={() => handleNodeHover(node)}
          onMouseLeave={() => handleNodeHover(null)}
        />

        {/* Language indicator */}
        <circle
          cx={node.x + node.radius * 0.6}
          cy={node.y - node.radius * 0.6}
          r={8}
          fill={node.language === 'greek' ? '#3B82F6' : '#DC2626'}
          stroke="#F5F4F2"
          strokeWidth="2"
          opacity={opacity}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: `${node.x}px ${node.y}px`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        <text
          x={node.x + node.radius * 0.6}
          y={node.y - node.radius * 0.6}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: '10px',
            fontWeight: 'bold',
            fill: '#F5F4F2',
            opacity: opacity,
            transform: `scale(${scale})`,
            transformOrigin: `${node.x}px ${node.y}px`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none'
          }}
        >
          {node.language === 'greek' ? 'Α' : 'L'}
        </text>

        {/* Node label */}
        <text
          x={node.x}
          y={node.y + node.radius + 20}
          textAnchor="middle"
          style={{
            fontSize: node.type === 'author' ? '14px' : '12px',
            fontWeight: node.type === 'author' ? 'bold' : 'normal',
            fill: highlighted ? '#F5F4F2' : '#9CA3AF',
            opacity: opacity,
            transform: `scale(${scale})`,
            transformOrigin: `${node.x}px ${node.y}px`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none'
          }}
        >
          {node.name.length > 20 ? node.name.substring(0, 17) + '...' : node.name}
        </text>
      </g>
    );
  }, [selectedNode, hoveredNode, animatedConnections, isNodeHighlighted, handleNodeClick, handleNodeHover]);

  const renderEdge = useCallback((edge: Edge) => {
    const sourceNode = ALL_NODES.find(n => n.id === edge.source);
    const targetNode = ALL_NODES.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return null;

    const highlighted = isEdgeHighlighted(edge);
    const opacity = highlighted ? 0.8 : 0.1;
    const strokeWidth = highlighted ? 3 : 1;

    return (
      <g key={`${edge.source}-${edge.target}`}>
        {/* Connection line */}
        <line
          x1={sourceNode.x}
          y1={sourceNode.y}
          x2={targetNode.x}
          y2={targetNode.y}
          stroke="#C9A227"
          strokeWidth={strokeWidth}
          opacity={opacity}
          strokeDasharray={edge.type === 'influence' ? 'none' : '5,5'}
          style={{
            transition: 'all 0.3s ease'
          }}
        />
        
        {/* Animated flow particles for highlighted connections */}
        {highlighted && (
          <circle
            r="3"
            fill="#C9A227"
            opacity="0.8"
          >
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path={`M${sourceNode.x},${sourceNode.y} L${targetNode.x},${targetNode.y}`}
            />
          </circle>
        )}
      </g>
    );
  }, [isEdgeHighlighted]);

  return (
    <div style={{ 
      backgroundColor: '#0D0D0F', 
      minHeight: '100vh', 
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '2rem',
        borderBottom: '1px solid #1E1E24',
        backgroundColor: '#141419'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #C9A227, #F59E0B)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            Classical Network
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Interactive visualization of intellectual connections in Classical Antiquity
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
        {/* Network Visualization */}
        <div style={{ 
          flex: 1, 
          position: 'relative',
          overflow: 'hidden'
        }}>
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <defs>
              <style>
                {`
                  @keyframes pulse {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.1); }
                  }
                  @keyframes flow {
                    0% { stroke-dashoffset: 20; }
                    100% { stroke-dashoffset: 0; }
                  }
                `}
              </style>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
              {/* Render edges first */}
              {EDGES.map(renderEdge)}
              
              {/* Render nodes */}
              {ALL_NODES.map(renderNode)}
            </g>
          </svg>

          {/* Legend */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: '#1E1E24',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #C9A227',
            fontSize: '0.875rem'
          }}>
            <h3 style={{ marginBottom: '0.75rem', color: '#C9A227', fontWeight: 'bold' }}>Legend</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#3B82F6', borderRadius: '50%' }}></div>
                <span style={{ color: '#9CA3AF' }}>Greek (Α)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#DC2626', borderRadius: '50%' }}></div>
                <span style={{ color: '#9CA3AF' }}>Latin (L)</span>
              </div>
            </div>
          </div>

          {/* Era Legend */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            backgroundColor: '#1E1E24',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #C9A227',
            fontSize: '0.875rem'
          }}>
            <h3 style={{ marginBottom: '0.75rem', color: '#C9A227', fontWeight: 'bold' }}>Eras</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(ERA_COLORS).map(([era, color]) => (
                <div key={era} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: color, borderRadius: '2px' }}></div>
                  <span style={{ color: '#9CA3AF', textTransform: 'capitalize' }}>{era.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <button
              onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#1E1E24',
                border: '1px solid #C9A227',
                borderRadius: '6px',
                color: '#F5F4F2',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#C9A227';
                e.currentTarget.style.color = '#0D0D0F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1E1E24';
                e.currentTarget.style.color = '#F5F4F2';
              }}
            >
              Reset View
            </button>
            <button
              onClick={() => setSelectedNode(null)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#1E1E24',
                border: '1px solid #C9A227',
                borderRadius: '6px',
                color: '#F5F4F2',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#C9A227';
                e.currentTarget.style.color = '#0D0D0F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1E1E24';
                e.currentTarget.style.color = '#F5F4F2';
              }}
            >
              Clear Selection
            </button>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedNode && (
          <div style={{
            width: '400px',
            backgroundColor: '#1E1E24',
            borderLeft: '1px solid #C9A227',
            padding: '2rem',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                color: '#C9A227'
              }