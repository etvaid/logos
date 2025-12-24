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
    description: 'Art of persuasive speaking and argumentation, focusing on logical, ethical, and emotional appeals.',
    connections: ['cicero', 'aristotle']
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
    description: 'Dramatic structure exploring human suffering, fate, and moral dilemmas.',
    connections: ['sophocles', 'seneca']
  },
  {
    id: 'fate-fortune',
    name: 'Fate & Fortune',
    type: 'concept',
    era: 'archaic',
    language: 'greek',
    x: 30,
    y: 450,
    radius: 24,
    description: 'Belief in predetermined destiny and the capricious influence of chance on human lives.',
    connections: ['homer', 'sophocles']
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
    description: 'Conception of a cosmos governed by gods and principles of justice.',
    connections: ['hesiod', 'plato']
  },
  {
    id: 'idealism',
    name: 'Idealism',
    type: 'concept',
    era: 'classical',
    language: 'greek',
    x: 200,
    y: 550,
    radius: 29,
    description: 'Philosophical doctrine emphasizing the primacy of mind, ideas, and spiritual values in shaping reality.',
    connections: ['plato']
  },
  {
    id: 'ethics',
    name: 'Ethics',
    type: 'concept',
    era: 'classical',
    language: 'greek',
    x: 680,
    y: 380,
    radius: 31,
    description: 'Moral principles governing conduct, character, and the pursuit of the good life.',
    connections: ['aristotle', 'seneca']
  }
];

const EDGES: Edge[] = [
  { source: 'homer', target: 'virgil', strength: 0.8, type: 'influence', description: 'Virgil emulated Homeric epic style and themes in the Aeneid.' },
  { source: 'homer', target: 'heroic-code', strength: 0.7, type: 'conceptual', description: 'Homer\'s epics exemplify the values of the heroic code.' },
  { source: 'homer', target: 'epic-tradition', strength: 0.9, type: 'conceptual', description: 'Homer initiated the epic tradition in Western literature.' },
  { source: 'hesiod', target: 'virgil', strength: 0.6, type: 'influence', description: 'Hesiod influenced Virgil\'s Georgics with didactic poetry.' },
  { source: 'hesiod', target: 'divine-order', strength: 0.8, type: 'conceptual', description: 'Hesiod\'s Theogony explores the divine order of the cosmos.' },
  { source: 'plato', target: 'aristotle', strength: 0.9, type: 'influence', description: 'Aristotle was a student of Plato and developed his philosophy in response.' },
  { source: 'plato', target: 'cicero', strength: 0.7, type: 'influence', description: 'Cicero translated and adapted Plato\'s philosophical ideas for a Roman audience.' },
  { source: 'plato', target: 'idealism', strength: 0.8, type: 'conceptual', description: 'Plato\'s theory of Forms is a foundational concept of idealism.' },
  { source: 'plato', target: 'philosophy', strength: 0.9, type: 'conceptual', description: 'Plato is a central figure in the history of philosophy.' },
  { source: 'aristotle', target: 'cicero', strength: 0.6, type: 'influence', description: 'Cicero drew upon Aristotle\'s ethics and politics in his own writings.' },
  { source: 'aristotle', target: 'seneca', strength: 0.5, type: 'influence', description: 'Seneca\'s ethics show some influence from Aristotelian ideas.' },
  { source: 'aristotle', target: 'philosophy', strength: 0.9, type: 'conceptual', description: 'Aristotle is a central figure in the history of philosophy.' },
  { source: 'aristotle', target: 'ethics', strength: 0.8, type: 'conceptual', description: 'Aristotle\'s Nicomachean Ethics is a foundational work in ethics.' },
  { source: 'sophocles', target: 'seneca', strength: 0.7, type: 'influence', description: 'Seneca adapted Sophoclean tragedies for a Roman audience.' },
  { source: 'sophocles', target: 'tragic-form', strength: 0.9, type: 'conceptual', description: 'Sophocles perfected the form of Greek tragedy.' },
  { source: 'sophocles', target: 'fate-fortune', strength: 0.8, type: 'conceptual', description: 'Sophocles\' plays explore the role of fate and fortune in human lives.' },
  { source: 'virgil', target: 'epic-tradition', strength: 0.7, type: 'conceptual', description: 'Virgil continued the epic tradition with the Aeneid.' },
  { source: 'cicero', target: 'philosophy', strength: 0.8, type: 'conceptual', description: 'Cicero popularized Greek philosophy in Rome.' },
  { source: 'cicero', target: 'rhetoric', strength: 0.9, type: 'conceptual', description: 'Cicero was a master of Roman rhetoric.' },
  { source: 'seneca', target: 'stoicism', strength: 0.9, type: 'conceptual', description: 'Seneca was a leading figure in Roman Stoicism.' },
  { source: 'seneca', target: 'ethics', strength: 0.8, type: 'conceptual', description: 'Seneca\'s letters explore Stoic ethics.' },
  { source: 'rhetoric', target: 'philosophy', strength: 0.6, type: 'conceptual', description: 'Rhetoric is interconnected to philosophical discourse.' },
  { source: 'stoicism', target: 'ethics', strength: 0.7, type: 'conceptual', description: 'Stoicism provides an ethical framework.' },
  { source: 'fate-fortune', target: 'heroic-code', strength: 0.5, type: 'conceptual', description: 'Fate/Fortune and the heroic code interplay in tragic narratives.' },
  { source: 'divine-order', target: 'philosophy', strength: 0.6, type: 'conceptual', description: 'Concepts of divine order influenced early philosophical thought.' },
  { source: 'idealism', target: 'philosophy', strength: 0.7, type: 'conceptual', description: 'Idealism is a major branch within philosophy.' }
];

const ERA_COLORS = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  'late antique': '#7C3AED',
  byzantine: '#059669',
};

const LANGUAGE_INDICATORS = {
  greek: '#3B82F6',
  latin: '#DC2626',
};

const LANGUAGE_LABELS = {
  greek: 'Α',
  latin: 'L',
};

const App = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [eraFilter, setEraFilter] = useState<string | null>(null);

  const applyEraFilter = (node: Node) => {
    return eraFilter ? node.era === eraFilter : true;
  };

  const visibleNodes = AUTHORS.concat(CONCEPTS).filter(applyEraFilter);
  const visibleEdges = EDGES.filter(edge => {
    return visibleNodes.some(node => node.id === edge.source) && visibleNodes.some(node => node.id === edge.target);
  });

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
  };

  const handleCloseDetails = () => {
    setSelectedNode(null);
  };

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const scaleFactor = event.deltaY > 0 ? 0.95 : 1.05;
    setTransform(prev => ({
      x: prev.x,
      y: prev.y,
      scale: Math.max(0.2, Math.min(3, prev.scale * scaleFactor)), // Limit zoom
    }));
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging) return;
    const dx = event.clientX - dragStart.x;
    const dy = event.clientY - dragStart.y;

    setTransform(prev => ({
      x: prev.x + dx,
      y: prev.y + dy,
      scale: prev.scale,
    }));

    setDragStart({ x: event.clientX, y: event.clientY });
  }, [isDragging, dragStart]);

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.addEventListener('wheel', handleWheel as any);
      svgRef.current.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp); // Use window to catch mouseup outside the SVG

      return () => {
        svgRef.current?.removeEventListener('wheel', handleWheel as any);
        svgRef.current?.removeEventListener('mousemove', handleMouseMove as any);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [handleWheel, handleMouseMove, handleMouseUp]);

  const handleEraFilterClick = (era: string | null) => {
    setEraFilter(eraFilter === era ? null : era);
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem 2rem', borderBottom: '1px solid #1E1E24', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#C9A227' }}>Logos: Ancient Thought Network</h1>
        <div>
          {Object.entries(ERA_COLORS).map(([era, color]) => (
            <button
              key={era}
              onClick={() => handleEraFilterClick(era)}
              style={{
                backgroundColor: eraFilter === era ? color : '#1E1E24',
                color: '#F5F4F2',
                border: 'none',
                padding: '0.5rem 1rem',
                marginRight: '0.5rem',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
            >
              {era.charAt(0).toUpperCase() + era.slice(1)}
            </button>
          ))}
          <button
            onClick={() => handleEraFilterClick(null)}
            style={{
              backgroundColor: eraFilter === null ? '#C9A227' : '#1E1E24',
              color: '#F5F4F2',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
          >
            All Eras
          </button>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <svg
            ref={svgRef}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#141419',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
          >
            <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
              {visibleEdges.map((edge, index) => {
                const sourceNode = visibleNodes.find(node => node.id === edge.source);
                const targetNode = visibleNodes.find(node => node.id === edge.target);

                if (!sourceNode || !targetNode) return null;

                const dx = targetNode.x - sourceNode.x;
                const dy = targetNode.y - sourceNode.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;

                const sourceX = sourceNode.x + normalizedDx * sourceNode.radius;
                const sourceY = sourceNode.y + normalizedDy * sourceNode.radius;
                const targetX = targetNode.x - normalizedDx * targetNode.radius;
                const targetY = targetNode.y - normalizedDy * targetNode.radius;

                return (
                  <line
                    key={index}
                    x1={sourceX}
                    y1={sourceY}
                    x2={targetX}
                    y2={targetY}
                    stroke="#6B7280"
                    strokeWidth={Math.max(0.5, edge.strength * 2)}
                    opacity={0.7}
                  />
                );
              })}

              {visibleNodes.map(node => (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`} style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }} onClick={() => handleNodeClick(node)}>
                  <circle
                    r={node.radius}
                    fill={ERA_COLORS[node.era]}
                    stroke={LANGUAGE_INDICATORS[node.language]}
                    strokeWidth={3}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  <text
                    textAnchor="middle"
                    dy=".3em"
                    fontSize={Math.max(8, node.radius / 3)}
                    fill="#F5F4F2"
                    style={{
                      userSelect: 'none',
                      pointerEvents: 'none',
                      fontWeight: 'bold',
                      textShadow: '1px 1px 2px #000'
                    }}
                  >
                    {node.language === 'greek' ? node.name.substring(0, Math.max(3, node.name.length / 10)) : node.name.substring(0, Math.max(3, node.name.length / 8))}
                  </text>
                  <text
                    x={node.radius + 5}
                    y={node.radius / 2}
                    fontSize={10}
                    fill={LANGUAGE_INDICATORS[node.language]}
                    style={{
                      userSelect: 'none',
                      pointerEvents: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    {LANGUAGE_LABELS[node.language]}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>

        {selectedNode && (
          <div style={{ width: '350px', backgroundColor: '#1E1E24', padding: '1rem', borderLeft: '1px solid #141419', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#F5F4F2' }}>{selectedNode.name}</h2>
              <button onClick={handleCloseDetails} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                Close
              </button>
            </div>
            <p style={{ color: '#9CA3AF', marginBottom: '0.5rem' }}>
              <strong style={{ color: '#F5F4F2' }}>Type:</strong> {selectedNode.type}
            </p>
            <p style={{ color: '#9CA3AF', marginBottom: '0.5rem' }}>
              <strong style={{ color: '#F5F4F2' }}>Era:</strong> {selectedNode.era.charAt(0).toUpperCase() + selectedNode.era.slice(1)}
            </p>
            {selectedNode.birth && (
              <p style={{ color: '#9CA3AF', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#F5F4F2' }}>Birth:</strong> {selectedNode.birth}
              </p>
            )}
            {selectedNode.death && (
              <p style={{ color: '#9CA3AF', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#F5F4F2' }}>Death:</strong> {selectedNode.death}
              </p>
            )}
            <p style={{ color: '#9CA3AF', marginBottom: '1rem', lineHeight: '1.4' }}>{selectedNode.description}</p>
            {selectedNode.works && selectedNode.works.length > 0 && (
              <>
                <h3 style={{ fontSize: '1rem', color: '#F5F4F2', marginBottom: '0.5rem' }}>Works:</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {selectedNode.works.map(work => (
                    <li key={work} style={{ color: '#9CA3AF', marginBottom: '0.25rem' }}>
                      {work}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {selectedNode.concepts && selectedNode.concepts.length > 0 && (
              <>
                <h3 style={{ fontSize: '1rem', color: '#F5F4F2', marginBottom: '0.5rem' }}>Concepts:</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {selectedNode.concepts.map(concept => (
                    <li key={concept} style={{ color: '#9CA3AF', marginBottom: '0.25rem' }}>
                      {concept}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </main>

      <footer style={{ padding: '1rem 2rem', borderTop: '1px solid #1E1E24', textAlign: 'center', color: '#9CA3AF' }}>
        © 2024 Logos Project
      </footer>
    </div>
  );
};

export default App;