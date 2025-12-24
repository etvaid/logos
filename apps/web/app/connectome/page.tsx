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
    description: 'Art of persuasive speaking and argumentation, essential for political and legal life in ancient Greece and Rome.',
    connections: ['cicero']
  },
  {
    id: 'ethics',
    name: 'Ethics',
    type: 'concept',
    era: 'classical',
    language: 'greek',
    x: 650,
    y: 350,
    radius: 30,
    description: 'Moral principles governing a person\'s behavior or the conducting of an activity.',
    connections: ['aristotle', 'seneca']
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
    description: 'Dramatic structure involving a protagonist\'s downfall due to fate, hubris, or tragic flaw.',
    connections: ['sophocles', 'seneca']
  },
  {
    id: 'fate-fortune',
    name: 'Fate & Fortune',
    type: 'concept',
    era: 'archaic',
    language: 'greek',
    x: 50,
    y: 450,
    radius: 24,
    description: 'Belief in predetermined destiny and the role of chance in human affairs.',
    connections: ['sophocles']
  },
  {
    id: 'divine-order',
    name: 'Divine Order',
    type: 'concept',
    era: 'archaic',
    language: 'greek',
    x: 420,
    y: 50,
    radius: 29,
    description: 'The perceived structure and rules governing the cosmos as ordained by the gods.',
    connections: ['hesiod']
  },
  {
    id: 'idealism',
    name: 'Idealism',
    type: 'concept',
    era: 'classical',
    language: 'greek',
    x: 250,
    y: 300,
    radius: 31,
    description: 'The philosophical theory that emphasizes the mental or ideal aspects of experience.',
    connections: ['plato']
  }
];

const EDGES: Edge[] = [
  { source: 'homer', target: 'virgil', type: 'influence', strength: 0.8, description: 'Virgil emulated Homer\'s epic style and themes in the Aeneid.' },
  { source: 'hesiod', target: 'virgil', type: 'influence', strength: 0.6, description: 'Virgil drew inspiration from Hesiod\'s didactic poetry in his Georgics.' },
  { source: 'plato', target: 'aristotle', type: 'influence', strength: 0.9, description: 'Aristotle was a student of Plato, but developed his own philosophical system.' },
  { source: 'plato', target: 'cicero', type: 'influence', strength: 0.7, description: 'Cicero translated and adapted Plato\'s philosophical ideas for a Roman audience.' },
  { source: 'aristotle', target: 'cicero', type: 'influence', strength: 0.6, description: 'Cicero drew on Aristotle\'s rhetoric and political theory in his own works.' },
  { source: 'aristotle', target: 'seneca', type: 'influence', strength: 0.5, description: 'Seneca engaged with Aristotle\'s ethics, but from a Stoic perspective.' },
  { source: 'sophocles', target: 'seneca', type: 'influence', strength: 0.7, description: 'Seneca adapted Sophocles\' tragedies for the Roman stage.' },
  { source: 'homer', target: 'epic-tradition', type: 'conceptual', strength: 1.0, description: 'Homer is the primary example of the epic tradition.' },
  { source: 'virgil', target: 'epic-tradition', type: 'conceptual', strength: 0.9, description: 'Virgil continued the epic tradition in Roman literature.' },
  { source: 'homer', target: 'heroic-code', type: 'conceptual', strength: 0.8, description: 'The Iliad and Odyssey exemplify the heroic code.' },
  { source: 'plato', target: 'philosophy', type: 'conceptual', strength: 1.0, description: 'Plato is a central figure in the history of philosophy.' },
  { source: 'aristotle', target: 'philosophy', type: 'conceptual', strength: 1.0, description: 'Aristotle is a central figure in the history of philosophy.' },
  { source: 'cicero', target: 'philosophy', type: 'conceptual', strength: 0.8, description: 'Cicero was a key transmitter of Greek philosophy to Rome.' },
  { source: 'seneca', target: 'stoicism', type: 'conceptual', strength: 0.9, description: 'Seneca is a major representative of Roman Stoicism.' },
  { source: 'cicero', target: 'stoicism', type: 'conceptual', strength: 0.7, description: 'Cicero engaged with Stoic ideas in his philosophical works.' },
  { source: 'cicero', target: 'rhetoric', type: 'conceptual', strength: 0.9, description: 'Cicero was a master of Roman rhetoric.' },
  { source: 'aristotle', target: 'ethics', type: 'conceptual', strength: 0.8, description: 'Aristotle\'s Nicomachean Ethics is a foundational work in ethics.' },
  { source: 'seneca', target: 'ethics', type: 'conceptual', strength: 0.7, description: 'Seneca\'s letters and essays explore Stoic ethics.' },
  { source: 'sophocles', target: 'tragic-form', type: 'conceptual', strength: 0.9, description: 'Sophocles is a master of the tragic form.' },
  { source: 'seneca', target: 'tragic-form', type: 'conceptual', strength: 0.8, description: 'Seneca adapted the tragic form for the Roman stage.' },
  { source: 'sophocles', target: 'fate-fortune', type: 'conceptual', strength: 0.7, description: 'Sophocles\' plays explore the role of fate and fortune in human life.' },
  { source: 'hesiod', target: 'divine-order', type: 'conceptual', strength: 0.8, description: 'Hesiod\'s Theogony describes the divine order of the cosmos.' },
  { source: 'plato', target: 'idealism', type: 'conceptual', strength: 0.9, description: 'Plato\'s Theory of Forms is a key expression of idealism.' }
];


const EraColors: { [key: string]: string } = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  'late antique': '#7C3AED',
  byzantine: '#059669',
};


const LanguageIndicators: { [key: string]: string } = {
  greek: 'Α',
  latin: 'L',
};


const ForceGraph = () => {
  const [nodes, setNodes] = useState<Node[]>([...AUTHORS, ...CONCEPTS]);
  const [edges, setEdges] = useState<Edge[]>(EDGES);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
  };

  const handleCloseDetails = () => {
    setSelectedNode(null);
  };


  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newScale = transform.scale * scaleFactor;

    // Limit zoom
    if (newScale < 0.5 || newScale > 3) {
      return;
    }

    const svg = svgRef.current;
    if (!svg) return;

    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const cursorPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());

    setTransform(prev => ({
      x: cursorPoint.x - (cursorPoint.x - prev.x) * (newScale / prev.scale),
      y: cursorPoint.y - (cursorPoint.y - prev.y) * (newScale / prev.scale),
      scale: newScale,
    }));
  }, [transform]);


  const handleMouseDown = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging) return;

    setTransform(prev => ({
      ...prev,
      x: prev.x + (event.clientX - dragStart.x) / prev.scale,
      y: prev.y + (event.clientY - dragStart.y) / prev.scale,
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
    if (containerRef.current) {
      containerRef.current.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        containerRef.current?.removeEventListener('wheel', handleWheel);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [handleWheel, handleMouseMove, handleMouseUp]);


  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', padding: '20px' }}>
      <header style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#C9A227', fontSize: '2.5em', fontWeight: 'bold', letterSpacing: '1px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Logos Professional Design System - Ancient Philosophy Network
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '1.2em' }}>
          Explore the connections between ancient authors and concepts.
        </p>
      </header>

      <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '800px', overflow: 'hidden', cursor: isDragging ? 'grabbing' : 'grab' }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{
            backgroundColor: '#141419',
            transition: 'background-color 0.3s ease',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}

        >
          <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
            {edges.map((edge) => {
              const sourceNode = nodes.find((node) => node.id === edge.source);
              const targetNode = nodes.find((node) => node.id === edge.target);

              if (!sourceNode || !targetNode) {
                return null;
              }

              const dx = targetNode.x - sourceNode.x;
              const dy = targetNode.y - sourceNode.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const unitDx = dx / distance;
              const unitDy = dy / distance;

              const sourceRadius = sourceNode.radius;
              const targetRadius = targetNode.radius;

              const sourceX = sourceNode.x + unitDx * sourceRadius;
              const sourceY = sourceNode.y + unitDy * sourceRadius;
              const targetX = targetNode.x - unitDx * targetRadius;
              const targetY = targetNode.y - unitDy * targetRadius;


              return (
                <line
                  key={`${edge.source}-${edge.target}`}
                  x1={sourceX}
                  y1={sourceY}
                  x2={targetX}
                  y2={targetY}
                  stroke="#6B7280"
                  strokeWidth={edge.strength * 2}
                  style={{ transition: 'stroke 0.3s ease' }}
                />
              );
            })}

            {nodes.map((node) => (
              <g key={node.id} style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
                onClick={() => handleNodeClick(node)}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  fill={EraColors[node.era]}
                  style={{
                    stroke: '#1E1E24',
                    strokeWidth: 3,
                    opacity: 0.8,
                    transition: 'fill 0.3s ease, opacity 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    const target = e.target as SVGCircleElement;
                    target.style.opacity = '1';
                  }}
                  onMouseOut={(e) => {
                    const target = e.target as SVGCircleElement;
                    target.style.opacity = '0.8';
                  }}
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#F5F4F2"
                  style={{
                    pointerEvents: 'none',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                  }}
                >
                  {node.name} {LanguageIndicators[node.language]}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {selectedNode && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#1E1E24',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.6)',
          zIndex: 1000,
          maxWidth: '600px',
          width: '90%',
          transition: 'all 0.3s ease',
        }}>
          <h2 style={{ color: '#C9A227', marginBottom: '10px', borderBottom: '1px solid #6B7280', paddingBottom: '5px' }}>
            {selectedNode.name}
          </h2>
          <p style={{ color: '#9CA3AF', marginBottom: '15px' }}>
            <strong>Type:</strong> {selectedNode.type}
          </p>
          <p style={{ color: '#9CA3AF', marginBottom: '15px' }}>
            <strong>Era:</strong> {selectedNode.era}
          </p>
          {selectedNode.birth && (
            <p style={{ color: '#9CA3AF', marginBottom: '15px' }}>
              <strong>Birth:</strong> {selectedNode.birth}
            </p>
          )}
          {selectedNode.death && (
            <p style={{ color: '#9CA3AF', marginBottom: '15px' }}>
              <strong>Death:</strong> {selectedNode.death}
            </p>
          )}
          <p style={{ color: '#F5F4F2', marginBottom: '20px', lineHeight: '1.6' }}>
            {selectedNode.description}
          </p>
          <button
            style={{
              backgroundColor: '#3B82F6',
              color: '#F5F4F2',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onClick={handleCloseDetails}
            onMouseOver={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = '#2563EB';
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = '#3B82F6';
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ForceGraph;