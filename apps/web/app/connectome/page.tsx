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
    x: 580,
    y: 200,
    radius: 27,
    description: 'Art of persuasive speaking and argumentation, refined through classical education and practice.',
    connections: ['cicero']
  },
  {
    id: 'tragic-form',
    name: 'Tragic Form',
    type: 'concept',
    era: 'classical',
    language: 'greek',
    x: 80,
    y: 350,
    radius: 26,
    description: 'Dramatic structure featuring a noble protagonist brought to ruin by fate or flaw.',
    connections: ['sophocles', 'seneca']
  },
  {
    id: 'divine-order',
    name: 'Divine Order',
    type: 'concept',
    era: 'archaic',
    language: 'greek',
    x: 450,
    y: 50,
    radius: 24,
    description: 'Cosmological principle positing a rational and providential arrangement of the universe by the gods.',
    connections: ['hesiod']
  },
  {
    id: 'fate-fortune',
    name: 'Fate & Fortune',
    type: 'concept',
    era: 'classical',
    language: 'greek',
    x: 20,
    y: 450,
    radius: 23,
    description: 'Belief in predetermined destiny and the unpredictable influence of chance on human affairs.',
    connections: ['sophocles']
  },
  {
    id: 'ethics',
    name: 'Ethics',
    type: 'concept',
    era: 'classical',
    language: 'greek',
    x: 650,
    y: 380,
    radius: 30,
    description: 'Moral principles governing conduct, explored through philosophical inquiry and practical application.',
    connections: ['aristotle', 'seneca']
  },
  {
    id: 'idealism',
    name: 'Idealism',
    type: 'concept',
    era: 'classical',
    language: 'greek',
    x: 250,
    y: 200,
    radius: 29,
    description: 'Philosophical doctrine emphasizing the primacy of mind and ideas in understanding reality.',
    connections: ['plato']
  }
];

const EDGES: Edge[] = [
  {
    source: 'homer',
    target: 'virgil',
    strength: 0.8,
    type: 'influence',
    description: 'Virgil draws heavily from Homer\'s epics in crafting the Aeneid.'
  },
  {
    source: 'hesiod',
    target: 'virgil',
    strength: 0.6,
    type: 'influence',
    description: 'Hesiod\'s didactic style and mythological themes influence Virgil\'s Georgics.'
  },
  {
    source: 'plato',
    target: 'aristotle',
    strength: 0.9,
    type: 'influence',
    description: 'Aristotle studies under Plato at the Academy before developing his own philosophical system.'
  },
  {
    source: 'plato',
    target: 'cicero',
    strength: 0.7,
    type: 'influence',
    description: 'Cicero translates and adapts Platonic dialogues for a Roman audience.'
  },
  {
    source: 'aristotle',
    target: 'cicero',
    strength: 0.7,
    type: 'influence',
    description: 'Cicero draws on Aristotle\'s rhetorical and ethical theories in his own works.'
  },
  {
    source: 'aristotle',
    target: 'seneca',
    strength: 0.6,
    type: 'influence',
    description: 'Seneca incorporates Aristotelian ethics into his Stoic philosophy.'
  },
  {
    source: 'sophocles',
    target: 'seneca',
    strength: 0.8,
    type: 'influence',
    description: 'Seneca adapts Sophoclean tragedies for the Roman stage.'
  },
  {
    source: 'homer',
    target: 'epic-tradition',
    strength: 1,
    type: 'conceptual',
    description: 'Homer\'s works exemplify the epic tradition.'
  },
  {
    source: 'virgil',
    target: 'epic-tradition',
    strength: 1,
    type: 'conceptual',
    description: 'Virgil\'s Aeneid is a key work in the epic tradition.'
  },
  {
    source: 'homer',
    target: 'heroic-code',
    strength: 1,
    type: 'conceptual',
    description: 'Homer\'s characters embody the heroic code.'
  },
  {
    source: 'plato',
    target: 'philosophy',
    strength: 1,
    type: 'conceptual',
    description: 'Plato is a central figure in the history of philosophy.'
  },
  {
    source: 'aristotle',
    target: 'philosophy',
    strength: 1,
    type: 'conceptual',
    description: 'Aristotle\'s works are foundational to philosophy.'
  },
  {
    source: 'cicero',
    target: 'philosophy',
    strength: 0.8,
    type: 'conceptual',
    description: 'Cicero engages with Greek philosophical traditions.'
  },
  {
    source: 'seneca',
    target: 'stoicism',
    strength: 1,
    type: 'conceptual',
    description: 'Seneca is a major figure in Stoic philosophy.'
  },
  {
    source: 'cicero',
    target: 'stoicism',
    strength: 0.7,
    type: 'conceptual',
    description: 'Cicero discusses Stoic ethics in his writings.'
  },
  {
    source: 'cicero',
    target: 'rhetoric',
    strength: 1,
    type: 'conceptual',
    description: 'Cicero is renowned for his rhetorical skill and theory.'
  },
  {
    source: 'sophocles',
    target: 'tragic-form',
    strength: 1,
    type: 'conceptual',
    description: 'Sophocles\' plays exemplify the tragic form.'
  },
  {
    source: 'seneca',
    target: 'tragic-form',
    strength: 0.9,
    type: 'conceptual',
    description: 'Seneca\'s tragedies adapt the Greek tragic form.'
  },
  {
    source: 'hesiod',
    target: 'divine-order',
    strength: 1,
    type: 'conceptual',
    description: 'Hesiod\'s Theogony explains the divine order.'
  },
    {
    source: 'sophocles',
    target: 'fate-fortune',
    strength: 1,
    type: 'conceptual',
    description: 'Sophocles explores the themes of fate and fortune in his tragedies.'
  },
  {
    source: 'aristotle',
    target: 'ethics',
    strength: 1,
    type: 'conceptual',
    description: 'Aristotle\'s Nicomachean Ethics is a key work in ethics.'
  },
  {
    source: 'seneca',
    target: 'ethics',
    strength: 1,
    type: 'conceptual',
    description: 'Seneca discusses ethics from a Stoic perspective.'
  },
  {
    source: 'plato',
    target: 'idealism',
    strength: 1,
    type: 'conceptual',
    description: 'Plato\'s theory of Forms is a form of idealism.'
  }
];

const ERA_COLORS = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  'late-antique': '#7C3AED',
  byzantine: '#059669',
};

const LANGUAGE_COLORS = {
  greek: '#3B82F6',
  latin: '#DC2626',
};


const NODE_TYPES = {
  author: 'Author',
  work: 'Work',
  concept: 'Concept',
};

const EDGE_TYPES = {
  influence: 'Influence',
  reference: 'Reference',
  response: 'Response',
  translation: 'Translation',
  conceptual: 'Conceptual',
};

const App = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>(AUTHORS.concat(CONCEPTS));
  const [edges, setEdges] = useState<Edge[]>(EDGES);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const zoomSensitivity = 0.1;

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const { deltaY, clientX, clientY } = event;
    const svg = svgRef.current;

    if (!svg) return;

    const { left, top } = svg.getBoundingClientRect();
    const mouseX = clientX - left;
    const mouseY = clientY - top;

    const zoomFactor = deltaY > 0 ? (1 - zoomSensitivity) : (1 + zoomSensitivity);

    setTransform(prev => {
      const newScale = Math.max(0.2, Math.min(3, prev.scale * zoomFactor)); // Limit zoom
      const newX = mouseX - (mouseX - prev.x) * (newScale / prev.scale);
      const newY = mouseY - (mouseY - prev.y) * (newScale / prev.scale);

      return { x: newX, y: newY, scale: newScale };
    });
  }, [zoomSensitivity]);


  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;

    setTransform(prev => ({
      ...prev,
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));
    setDragStart({ x: event.clientX, y: event.clientY });
  }, [isDragging, dragStart]);


  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (svgRef.current) {
        svgRef.current.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleWheel]);

  const calculateCurve = (source: { x: number; y: number }, target: { x: number; y: number }) => {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const sharpness = 0.3; // Adjust for desired curve sharpness
    const controlPointOffset = distance * sharpness;

    const controlX1 = source.x + dx * 0.3 + dy * 0.3; // Rotate control point a bit
    const controlY1 = source.y + dy * 0.3 - dx * 0.3;

    const controlX2 = target.x - dx * 0.3 - dy * 0.3;
    const controlY2 = target.y - dy * 0.3 + dx * 0.3;

    return `M${source.x},${source.y} C${controlX1},${controlY1} ${controlX2},${controlY2} ${target.x},${target.y}`;
  };

  const getLanguageIndicator = (language: string) => {
    return language === 'greek' ? 'Α' : 'L';
  };


  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '250px', height: '100%', backgroundColor: '#1E1E24', padding: '20px', boxSizing: 'border-box', overflowY: 'auto', boxShadow: '3px 0px 5px rgba(0,0,0,0.3)' }}>
        <h2 style={{ color: '#C9A227', marginBottom: '15px' }}>Logos System</h2>
        <h3 style={{ color: '#9CA3AF', marginBottom: '10px' }}>Legend</h3>

        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <svg width="20" height="20">
              <circle cx="10" cy="10" r="8" fill="#D97706" />
            </svg>
            <span style={{ marginLeft: '5px', color: '#F5F4F2' }}>Archaic</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <svg width="20" height="20">
              <circle cx="10" cy="10" r="8" fill="#F59E0B" />
            </svg>
            <span style={{ marginLeft: '5px', color: '#F5F4F2' }}>Classical</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <svg width="20" height="20">
              <circle cx="10" cy="10" r="8" fill="#3B82F6" />
            </svg>
            <span style={{ marginLeft: '5px', color: '#F5F4F2' }}>Hellenistic</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <svg width="20" height="20">
              <circle cx="10" cy="10" r="8" fill="#DC2626" />
            </svg>
            <span style={{ marginLeft: '5px', color: '#F5F4F2' }}>Imperial</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <svg width="20" height="20">
              <circle cx="10" cy="10" r="8" fill="#7C3AED" />
            </svg>
            <span style={{ marginLeft: '5px', color: '#F5F4F2' }}>Late Antique</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <svg width="20" height="20">
              <circle cx="10" cy="10" r="8" fill="#059669" />
            </svg>
            <span style={{ marginLeft: '5px', color: '#F5F4F2' }}>Byzantine</span>
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <svg width="20" height="20">
              <circle cx="10" cy="10" r="8" fill="#3B82F6" />
              <text x="10" y="15" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#F5F4F2">Α</text>
            </svg>
            <span style={{ marginLeft: '5px', color: '#F5F4F2' }}>Greek</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <svg width="20" height="20">
              <circle cx="10" cy="10" r="8" fill="#DC2626" />
              <text x="10" y="15" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#F5F4F2">L</text>
            </svg>
            <span style={{ marginLeft: '5px', color: '#F5F4F2' }}>Latin</span>
          </div>
        </div>
      </div>


      <svg
        width="100%"
        height="100%"
        ref={svgRef}
        style={{ backgroundColor: '#0D0D0F', cursor: isDragging ? 'grabbing' : 'grab', transition: 'background-color 0.3s' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <filter id="drop-shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feComponentTransfer in="offsetblur" type="linear" slope="1.0" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          {edges.map(edge => {
            const sourceNode = nodes.find(node => node.id === edge.source);
            const targetNode = nodes.find(node => node.id === edge.target);

            if (!sourceNode || !targetNode) return null;

            const curvePath = calculateCurve(sourceNode, targetNode);
            return (
              <path
                key={`${edge.source}-${edge.target}`}
                d={curvePath}
                style={{
                  fill: 'none',
                  stroke: '#6B7280',
                  strokeWidth: 2,
                  opacity: edge.strength,
                  transition: 'opacity 0.3s',
                }}
              />
            );
          })}

          {nodes.map(node => (
            <g
              key={node.id}
              style={{
                transform: `translate(${node.x}px, ${node.y}px)`,
                cursor: 'pointer',
                transition: 'transform 0.2s, filter 0.2s',
                filter: selectedNode?.id === node.id ? 'drop-shadow' : 'none',
              }}
              onClick={() => setSelectedNode(node)}
            >
              <circle
                cx={0}
                cy={0}
                r={node.radius}
                style={{
                  fill: ERA_COLORS[node.era] || '#ccc',
                  stroke: '#1E1E24',
                  strokeWidth: 2,
                }}
              />
                <text
                  x={0}
                  y={node.radius + 15}
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill={LANGUAGE_COLORS[node.language] || '#F5F4F2'}
                  style={{
                    pointerEvents: 'none', // Ensure text doesn't block click
                    textShadow: '1px 1px 2px #000',
                  }}
                >
                  {getLanguageIndicator(node.language)}
                </text>
              <text
                x={0}
                y={0}
                dy=".3em"
                fontSize="14"
                textAnchor="middle"
                fill="#F5F4F2"
                style={{ pointerEvents: 'none', fontWeight: 'bold', textShadow: '1px 1px 2px #000' }}
              >
                {node.name.split(' ')[0]}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {selectedNode && (
        <div style={{ position: 'absolute', top: '20px', right: '20px', width: '300px', backgroundColor: '#1E1E24', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', transition: 'all 0.3s' }}>
          <h3 style={{ color: '#C9A227', marginBottom: '10px' }}>{selectedNode.name}</h3>
          <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>
            <strong>Type:</strong> {NODE_TYPES[selectedNode.type as keyof typeof NODE_TYPES] || selectedNode.type}
          </p>
          <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>
            <strong>Era:</strong> {selectedNode.era}
          </p>
          {selectedNode.birth && (
            <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>
              <strong>Birth:</strong> {selectedNode.birth}
            </p>
          )}
          {selectedNode.death && (
            <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>
              <strong>Death:</strong> {selectedNode.death}
            </p>
          )}
          <p style={{ color: '#F5F4F2', marginBottom: '10px' }}>{selectedNode.description}</p>
          {selectedNode.works && selectedNode.works.length > 0 && (
            <>
              <h4 style={{ color: '#9CA3AF', marginTop: '10px', marginBottom: '5px' }}>Works:</h4>
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {selectedNode.works.map(work => (
                  <li key={work} style={{ color: '#F5F4F2', marginBottom: '3px' }}>
                    {work}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;