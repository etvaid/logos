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
    x: 350,
    y: 420,
    radius: 26,
    description: 'Art of persuasive speaking through logos, pathos, and ethos in judicial, deliberative, and epideictic contexts.',
    connections: ['cicero', 'aristotle']
  },
  {
    id: 'tragic-form',
    name: 'Tragic Form',
    type: 'concept',
    era: 'classical',
    language: 'greek',
    x: 50,
    y: 350,
    radius: 24,
    description: 'Dramatic structure achieving κάθαρσις through μίμησις of serious action with περιπέτεια and ἀναγνώρισις.',
    connections: ['sophocles', 'aristotle', 'seneca']
  },
  {
    id: 'divine-order',
    name: 'Divine Order',
    type: 'concept',
    era: 'archaic',
    language: 'greek',
    x: 450,
    y: 50,
    radius: 23,
    description: 'Cosmic hierarchy from primordial Χάος through Titanomachy to Olympian sovereignty.',
    connections: ['hesiod', 'plato']
  },
  {
    id: 'fate-fortune',
    name: 'Fate & Fortune',
    type: 'concept',
    era: 'classical',
    language: 'greek',
    x: 80,
    y: 450,
    radius: 27,
    description: 'Tension between μοῖρα (fate), τύχη (fortune), and human agency in determining outcomes.',
    connections: ['sophocles', 'seneca']
  }
];

const WORKS: Node[] = [
  {
    id: 'iliad',
    name: 'Ἰλιάς (Iliad)',
    type: 'work',
    era: 'archaic',
    language: 'greek',
    x: 150,
    y: 120,
    radius: 20,
    description: 'Epic of Achilles\' wrath during the Trojan War. Foundational text for heroic poetry and tragic themes.',
    connections: ['homer', 'epic-tradition', 'heroic-code']
  },
  {
    id: 'republic',
    name: 'Πολιτεία (Republic)',
    type: 'work',
    era: 'classical', 
    language: 'greek',
    x: 320,
    y: 180,
    radius: 18,
    description: 'Philosophical dialogue on justice, ideal state, and the philosopher-king through the Cave allegory.',
    connections: ['plato', 'philosophy']
  },
  {
    id: 'aeneid',
    name: 'Aeneis',
    type: 'work',
    era: 'imperial',
    language: 'latin',
    x: 200,
    y: 350,
    radius: 19,
    description: 'National epic tracing Trojan origins of Rome through pietas and imperial destiny.',
    connections: ['virgil', 'homer', 'epic-tradition']
  }
];

const ALL_NODES = [...AUTHORS, ...CONCEPTS, ...WORKS];

const EDGES: Edge[] = [
  { source: 'homer', target: 'virgil', strength: 0.9, type: 'influence', description: 'Virgil models the Aeneid on Homeric epic structure and themes' },
  { source: 'plato', target: 'aristotle', strength: 0.8, type: 'influence', description: 'Aristotle develops and critiques Platonic philosophy' },
  { source: 'aristotle', target: 'cicero', strength: 0.7, type: 'reference', description: 'Cicero adapts Aristotelian ethics and politics for Roman context' },
  { source: 'sophocles', target: 'seneca', strength: 0.6, type: 'influence', description: 'Seneca adapts Sophoclean tragic themes for Roman stage' },
  { source: 'homer', target: 'epic-tradition', strength: 0.9, type: 'conceptual', description: 'Homer establishes the epic formulaic tradition' },
  { source: 'plato', target: 'philosophy', strength: 0.8, type: 'conceptual', description: 'Plato systematizes philosophical inquiry through dialectic' },
  { source: 'aristotle', target: 'philosophy', strength: 0.8, type: 'conceptual', description: 'Aristotle creates comprehensive philosophical system' },
  { source: 'seneca', target: 'stoicism', strength: 0.7, type: 'conceptual', description: 'Seneca develops Roman Stoic practical ethics' },
  { source: 'cicero', target: 'rhetoric', strength: 0.8, type: 'conceptual', description: 'Cicero perfects the art of Roman oratory' },
  { source: 'sophocles', target: 'tragic-form', strength: 0.7, type: 'conceptual', description: 'Sophocles masters Attic tragic dramatic structure' },
  { source: 'hesiod', target: 'divine-order', strength: 0.8, type: 'conceptual', description: 'Hesiod systematizes Greek theogonic mythology' }
];

const ERA_COLORS = {
  'archaic': '#D97706',
  'classical': '#F59E0B',
  'hellenistic': '#3B82F6', 
  'imperial': '#DC2626',
  'late-antique': '#7C3AED',
  'byzantine': '#059669'
};

export default function ConnectomePage() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [filterEra, setFilterEra] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [showEdges, setShowEdges] = useState(true);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement>(null);

  const filteredNodes = ALL_NODES.filter(node => {
    if (filterEra !== 'all' && node.era !== filterEra) return false;
    if (filterType !== 'all' && node.type !== filterType) return false;
    if (filterLanguage !== 'all' && node.language !== filterLanguage) return false;
    return true;
  });

  const filteredEdges = EDGES.filter(edge => {
    const sourceNode = filteredNodes.find(n => n.id === edge.source);
    const targetNode = filteredNodes.find(n => n.id === edge.target);
    return sourceNode && targetNode;
  });

  const getConnectedNodes = (nodeId: string): string[] => {
    const connections = new Set<string>();
    filteredEdges.forEach(edge => {
      if (edge.source === nodeId) connections.add(edge.target);
      if (edge.target === nodeId) connections.add(edge.source);
    });
    return Array.from(connections);
  };

  const handleNodeClick = (node: Node) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node);
  };

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
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.3, Math.min(3, prev.scale * scaleFactor))
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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: '#141419', 
        borderBottom: '1px solid #1E1E24',
        padding: '1rem 2rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Link href="/" style={{ color: '#C9A227', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
              📚 Logos
            </Link>
            <h1 style={{ margin: '0.5rem 0 0 0', fontSize: '1.8rem', fontWeight: '700' }}>
              Textual Connectome
            </h1>
            <p style={{ margin: '0.25rem 0 0 0', color: '#9CA3AF', fontSize: '0.95rem' }}>
              Interactive network of authors, works, and concepts in classical antiquity
            </p>
          </div>
          <button
            onClick={resetView}
            style={{
              backgroundColor: '#C9A227',
              color: '#0D0D0F',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E5B429'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#C9A227'}
          >
            Reset View
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
        {/* Controls Panel */}
        <div style={{ 
          width: '300px', 
          backgroundColor: '#1E1E24', 
          padding: '1.5rem',
          borderRight: '1px solid #141419',
          overflowY: 'auto'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#C9A227', fontSize: '1.1rem' }}>Filters</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>
              Era
            </label>
            <select 
              value={filterEra}
              onChange={(e) => setFilterEra(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#141419',
                color: '#F5F4F2',
                border: '1px solid #6B7280',
                borderRadius: '4px',
                padding: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">All Eras</option>
              <option value="archaic">Archaic (800-500 BCE)</option>
              <option value="classical">Classical (500-323 BCE)</option>
              <option value="hellenistic">Hellenistic (323-31 BCE)</option>
              <option value="imperial">Imperial (31 BCE-284 CE)</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>
              Type
            </label>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#141419',
                color: '#F5F4F2',
                border: '1px solid #6B7280',
                borderRadius: '4px',
                padding: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">All Types</option>
              <option value="author">Authors</option>
              <option value="work">Works</option>
              <option value="concept">Concepts</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>
              Language
            </label>
            <select 
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#141419',
                color: '#F5F4F2',
                border: '1px solid #6B7280',
                borderRadius: '4px',
                padding: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">All Languages</option>
              <option value="greek">Greek</option>
              <option value="latin">Latin</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#9CA3AF' }}>
              <input
                type="checkbox"
                checked={showEdges}
                onChange={(e) => setShowEdges(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Show Connections
            </label>
          </div>

          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#C9A227', fontSize: '0.95rem' }}>Legend</h4>
            <div style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ color: '#3B82F6' }}>●</span> Authors (Greek)
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ color: '#DC2626' }}>●</span> Authors (Latin)
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ color: '#9CA3AF' }}>◆</span> Works
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ color: '#C9A227' }}>▲</span> Concepts
              </div>
            </div>
          </div>
        </div>

        {/* Network Visualization */}
        <div style={{ flex: 1, position: 'relative', backgroundColor: '#0D0D0F' }}>
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
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
              {/* Edges */}
              {showEdges && filteredEdges.map((edge, index) => {
                const sourceNode = filteredNodes.find(n => n.id === edge.source);
                const targetNode = filteredNodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isHighlighted = selectedNode && (
                  selectedNode.id === edge.source || selectedNode.id === edge.target
                );

                return (
                  <line
                    key={index}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isHighlighted ? '#C9A227' : '#6B7280'}
                    strokeWidth={isHighlighted ? 2 : 1}
                    strokeOpacity={isHighlighted ? 0.8 : 0.3}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                );
              })}

              {/* Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isConnected = selectedNode && getConnectedNodes(selectedNode.id).includes(node.id);
                const isHovered = hoveredNode === node.id;
                
                let nodeColor = ERA_COLORS[node.era as keyof typeof ERA_COLORS];
                if (node.type === 'author') {
                  nodeColor = node.language === 'greek' ? '#3B82F6' : '#DC2626';
                } else if (node.type === 'work') {
                  nodeColor = '#9CA3AF';
                } else if (node.type === 'concept') {
                  nodeColor = '#C9A227';
                }

                const opacity = selectedNode ? (isSelected || isConnected ? 1 : 0.3) : 1;

                return (
                  <g key={node.id}>
                    {/* Node shape */}
                    {node.type === 'author' && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.radius}
                        fill={nodeColor}
                        fillOpacity={opacity}
                        stroke={isSelected ? '#C9A227' : 'transparent'}
                        strokeWidth={isSelected ? 3 : 0}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          filter: isHovered ? 'url(#glow)' : 'none'
                        }}
                        onClick={() => handleNodeClick(node)}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                      />
                    )}
                    
                    {node.type === 'work' && (
                      <rect
                        x={node.x - node.radius}
                        y={node.y - node.radius}
                        width={node.radius * 2}
                        height={node.radius * 2}
                        fill={nodeColor}
                        fillOpacity={opacity}
                        stroke={isSelected ? '#C9A227' : 'transparent'}
                        strokeWidth={isSelected ? 3 : 0}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          filter: isHovered ? 'url(#glow)' : 'none'
                        }}
                        onClick={() => handleNodeClick(node)}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                      />
                    )}
                    
                    {node.type === 'concept' && (
                      <polygon
                        points={`${node.x},${node.y - node.radius} ${node.x + node.radius},${node.y + node.radius} ${node.x - node.radius},${node.y + node.radius}`}
                        fill={nodeColor}
                        fillOpacity={opacity}
                        stroke={isSelected ? '#C9A227' : 'transparent'}
                        strokeWidth={isSelected ? 3 : 0}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          filter: isHovered ? 'url(#glow)' : 'none'
                        }}
                        onClick={() => handleNodeClick(node)}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                      />
                    )}

                    {/* Node label */}
                    <text
                      x={node.x}
                      y={node.y + node.radius + 15}
                      textAnchor="middle"
                      fill="#F5F4F2"
                      fillOpacity