'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// Design system constants
const ERA_COLORS = {
  'Archaic': '#D97706',
  'Classical': '#F59E0B',
  'Hellenistic': '#3B82F6',
  'Imperial Rome': '#DC2626',
  'Late Antiquity': '#7C3AED',
  'Byzantine': '#059669'
};

const EVIDENCE_ICONS = {
  'Literary': '📜',
  'Epigraphic': '🪨',
  'Archaeological': '🏛️',
  'Numismatic': '🪙'
};

const CATEGORIES = ['Political', 'Economic', 'Social', 'Religious', 'Intellectual'];

interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  category: string;
  era: string;
  region: string;
  importance: number;
  evidence: Array<{
    type: string;
    reliability: number;
    sources: string[];
  }>;
  description: string;
  connections: string[];
}

const DEMO_EVENTS: TimelineEvent[] = [
  {
    id: '1',
    year: -490,
    title: 'Battle of Marathon',
    category: 'Political',
    era: 'Classical',
    region: 'Greek',
    importance: 8,
    evidence: [
      { type: 'Literary', reliability: 90, sources: ['Herodotus', 'Plutarch'] },
      { type: 'Archaeological', reliability: 85, sources: ['Marathon tumulus'] }
    ],
    description: 'Athenian victory over Persian forces, marking a turning point in the Persian Wars.',
    connections: ['2', '3']
  },
  {
    id: '2',
    year: -399,
    title: 'Death of Socrates',
    category: 'Intellectual',
    era: 'Classical',
    region: 'Greek',
    importance: 9,
    evidence: [
      { type: 'Literary', reliability: 85, sources: ['Plato', 'Xenophon'] }
    ],
    description: 'Execution of the philosopher Socrates, marking the end of an era in Greek philosophy.',
    connections: ['1']
  },
  {
    id: '3',
    year: -323,
    title: 'Death of Alexander',
    category: 'Political',
    era: 'Hellenistic',
    region: 'All',
    importance: 10,
    evidence: [
      { type: 'Literary', reliability: 80, sources: ['Plutarch', 'Arrian', 'Diodorus'] },
      { type: 'Archaeological', reliability: 75, sources: ['Babylon excavations'] }
    ],
    description: 'Death of Alexander the Great in Babylon, leading to the fragmentation of his empire.',
    connections: ['4']
  },
  {
    id: '4',
    year: -44,
    title: 'Assassination of Caesar',
    category: 'Political',
    era: 'Imperial Rome',
    region: 'Roman',
    importance: 10,
    evidence: [
      { type: 'Literary', reliability: 95, sources: ['Plutarch', 'Suetonius', 'Cicero'] },
      { type: 'Numismatic', reliability: 90, sources: ['Ides of March coins'] }
    ],
    description: 'Julius Caesar assassinated on the Ides of March, ending the Roman Republic.',
    connections: ['5']
  },
  {
    id: '5',
    year: 33,
    title: 'Crucifixion',
    category: 'Religious',
    era: 'Imperial Rome',
    region: 'Levant',
    importance: 10,
    evidence: [
      { type: 'Literary', reliability: 70, sources: ['Gospels', 'Josephus', 'Tacitus'] }
    ],
    description: 'Crucifixion of Jesus, foundational event of Christianity.',
    connections: ['6']
  },
  {
    id: '6',
    year: 313,
    title: 'Edict of Milan',
    category: 'Political',
    era: 'Late Antiquity',
    region: 'Roman',
    importance: 9,
    evidence: [
      { type: 'Literary', reliability: 85, sources: ['Lactantius', 'Eusebius'] },
      { type: 'Epigraphic', reliability: 80, sources: ['Imperial inscriptions'] }
    ],
    description: 'Constantine legalizes Christianity throughout the Roman Empire.',
    connections: ['7']
  },
  {
    id: '7',
    year: 476,
    title: 'Fall of Rome',
    category: 'Political',
    era: 'Late Antiquity',
    region: 'Roman',
    importance: 10,
    evidence: [
      { type: 'Literary', reliability: 75, sources: ['Procopius', 'Jordanes'] },
      { type: 'Archaeological', reliability: 85, sources: ['Urban decline evidence'] }
    ],
    description: 'Odoacer deposes Romulus Augustulus, traditionally marking the end of the Western Roman Empire.',
    connections: ['8']
  },
  {
    id: '8',
    year: 529,
    title: 'Closing of Academy',
    category: 'Intellectual',
    era: 'Byzantine',
    region: 'Greek',
    importance: 7,
    evidence: [
      { type: 'Literary', reliability: 80, sources: ['Malalas', 'Simplicius'] }
    ],
    description: 'Justinian closes the Platonic Academy in Athens, ending ancient philosophical schools.',
    connections: []
  }
];

function TimelineEvent3D({ event, position, isSelected, onClick, currentYear, animating }: {
  event: TimelineEvent;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
  currentYear: number;
  animating: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const isVisible = !animating || event.year <= currentYear;
  const opacity = isVisible ? 1 : 0.1;
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      if (isSelected) {
        meshRef.current.scale.setScalar(1.5 + Math.sin(state.clock.getElapsedTime() * 3) * 0.1);
      } else if (hovered) {
        meshRef.current.scale.setScalar(1.2);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const color = ERA_COLORS[event.era as keyof typeof ERA_COLORS];
  const size = event.importance / 10;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          transparent
          opacity={opacity}
          emissive={isSelected ? color : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>
      
      {(hovered || isSelected) && (
        <Html distanceFactor={10}>
          <div className="bg-slate-900 text-white p-2 rounded border border-yellow-600 min-w-48">
            <div className="font-bold text-yellow-400">{event.title}</div>
            <div className="text-sm text-gray-300">{Math.abs(event.year)} {event.year < 0 ? 'BCE' : 'CE'}</div>
            <div className="text-xs text-gray-400">{event.category} • {event.era}</div>
            <div className="flex gap-1 mt-1">
              {event.evidence.map((ev, i) => (
                <span key={i} title={`${ev.type}: ${ev.reliability}%`}>
                  {EVIDENCE_ICONS[ev.type as keyof typeof EVIDENCE_ICONS]}
                </span>
              ))}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function TimelineAxis() {
  const points = [];
  
  // Main timeline axis
  for (let year = -800; year <= 1453; year += 100) {
    const x = (year + 800) / 2253 * 20 - 10;
    points.push(new THREE.Vector3(x, -3, 0));
  }
  
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <>
      {/* Main axis line */}
      <line geometry={geometry}>
        <lineBasicMaterial color="#C9A227" linewidth={2} />
      </line>
      
      {/* Year markers */}
      {[-800, -500, -323, -31, 284, 600, 1453].map((year) => {
        const x = (year + 800) / 2253 * 20 - 10;
        return (
          <group key={year} position={[x, -3.5, 0]}>
            <Text
              fontSize={0.3}
              color="#C9A227"
              anchorX="center"
              anchorY="middle"
            >
              {Math.abs(year)} {year < 0 ? 'BCE' : 'CE'}
            </Text>
          </group>
        );
      })}
      
      {/* Category labels */}
      {CATEGORIES.map((category, index) => (
        <Text
          key={category}
          position={[-12, index - 2, 0]}
          fontSize={0.4}
          color="#F5F4F2"
          anchorX="left"
          anchorY="middle"
        >
          {category}
        </Text>
      ))}
    </>
  );
}

function ConnectionLines({ events, selectedEvent }: {
  events: TimelineEvent[];
  selectedEvent: TimelineEvent | null;
}) {
  if (!selectedEvent || selectedEvent.connections.length === 0) return null;

  const getEventPosition = (eventId: string): [number, number, number] => {
    const event = events.find(e => e.id === eventId);
    if (!event) return [0, 0, 0];
    
    const x = (event.year + 800) / 2253 * 20 - 10;
    const y = CATEGORIES.indexOf(event.category) - 2;
    return [x, y, 0];
  };

  const selectedPos = getEventPosition(selectedEvent.id);

  return (
    <>
      {selectedEvent.connections.map(connId => {
        const connPos = getEventPosition(connId);
        const points = [
          new THREE.Vector3(...selectedPos),
          new THREE.Vector3(...connPos)
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        return (
          <line key={connId} geometry={geometry}>
            <lineBasicMaterial color="#C9A227" opacity={0.6} transparent />
          </line>
        );
      })}
    </>
  );
}

function Scene({ events, selectedEvent, onEventSelect, currentYear, animating }: {
  events: TimelineEvent[];
  selectedEvent: TimelineEvent | null;
  onEventSelect: (event: TimelineEvent | null) => void;
  currentYear: number;
  animating: boolean;
}) {
  const getEventPosition = (event: TimelineEvent): [number, number, number] => {
    const x = (event.year + 800) / 2253 * 20 - 10; // Scale to -10 to +10
    const y = CATEGORIES.indexOf(event.category) - 2; // Center around 0
    const z = Math.random() * 0.5 - 0.25; // Small random Z for visual interest
    return [x, y, z];
  };

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#C9A227" />
      
      <TimelineAxis />
      
      <ConnectionLines events={events} selectedEvent={selectedEvent} />
      
      {events.map(event => (
        <TimelineEvent3D
          key={event.id}
          event={event}
          position={getEventPosition(event)}
          isSelected={selectedEvent?.id === event.id}
          onClick={() => onEventSelect(event)}
          currentYear={currentYear}
          animating={animating}
        />
      ))}
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
}

export default function TimelinePage() {
  const [events] = useState<TimelineEvent[]>(DEMO_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [filteredEras, setFilteredEras] = useState<string[]>(Object.keys(ERA_COLORS));
  const [filteredCategories, setFilteredCategories] = useState<string[]>(CATEGORIES);
  const [animating, setAnimating] = useState(false);
  const [currentYear, setCurrentYear] = useState(-800);

  const filteredEvents = events.filter(event => 
    filteredEras.includes(event.era) && 
    filteredCategories.includes(event.category)
  );

  const handlePlay = useCallback(() => {
    if (animating) return;
    
    setAnimating(true);
    setCurrentYear(-800);
    
    const animate = () => {
      setCurrentYear(prev => {
        const next = prev + 50;
        if (next > 1453) {
          setAnimating(false);
          return 1453;
        }
        setTimeout(animate, 200);
        return next;
      });
    };
    
    setTimeout(animate, 200);
  }, [animating]);

  const handleStop = () => {
    setAnimating(false);
    setCurrentYear(1453);
  };

  const toggleEraFilter = (era: string) => {
    setFilteredEras(prev => 
      prev.includes(era) 
        ? prev.filter(e => e !== era)
        : [...prev, era]
    );
  };

  const toggleCategoryFilter = (category: string) => {
    setFilteredCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-yellow-600/30 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">
            Interactive Classical Timeline
          </h1>
          <p className="text-gray-300">
            Explore 2000 years of classical history through our 3D visualization
          </p>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Controls Sidebar */}
        <div className="w-80 bg-slate-900 border-r border-yellow-600/30 p-4 overflow-y-auto">
          {/* Animation Controls */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Animation</h3>
            <div className="flex gap-2">
              <button
                onClick={handlePlay}
                disabled={animating}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded text-sm"
              >
                ▶ Play
              </button>
              <button
                onClick={handleStop}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
              >
                ⏹ Stop
              </button>
            </div>
            {animating && (
              <div className="mt-2 text-sm text-gray-300">
                Current: {Math.abs(currentYear)} {currentYear < 0 ? 'BCE' : 'CE'}
              </div>
            )}
          </div>

          {/* Era Filters */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Eras</h3>
            <div className="space-y-2">
              {Object.entries(ERA_COLORS).map(([era, color]) => (
                <label key={era} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filteredEras.includes(era)}
                    onChange={() => toggleEraFilter(era)}
                    className="mr-2"
                  />
                  <div 
                    className="w-4 h-4 rounded mr-2"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm">{era}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Categories</h3>
            <div className="space-y-2">
              {CATEGORIES.map(category => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filteredCategories.includes(category)}
                    onChange={() => toggleCategoryFilter(category)}
                    className="mr-2"
                  />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Selected Event Details */}
          {selectedEvent && (
            <div className="bg-slate-800 rounded p-4">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                {selectedEvent.title}
              </h3>
              <div className="text-sm space-y-2">
                <div>
                  <strong>Year:</strong> {Math.abs(selectedEvent.year)} {selectedEvent.year < 0 ? 'BCE' : 'CE'}
                </div>
                <div>
                  <strong>Category:</strong> {selectedEvent.category}
                </div>
                <div>
                  <strong>Era:</strong> {selectedEvent.era}
                </div>
                <div>
                  <strong>Region:</strong> {selectedEvent.region}
                </div>
                <div className="mt-3">
                  <strong>Evidence:</strong>
                  <div className="mt-1 space-y-1">
                    {selectedEvent.evidence.map((ev, i) => (
                      <div key={i} className="text-xs">
                        {EVIDENCE_ICONS[ev.type as keyof typeof EVIDENCE_ICONS]} {ev.type}: {ev.reliability}%
                        <div className="text-gray-400 ml-4">
                          {ev.sources.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3">
                  <strong>Description:</strong>
                  <p className="text-gray-300 text-xs mt-1">{selectedEvent.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative">
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            <Scene 
              events={filteredEvents}
              selectedEvent={selectedEvent}
              onEventSelect={setSelectedEvent}
              currentYear={currentYear}
              animating={animating}
            />
          </Canvas>
          
          {/* Instructions */}
          <div className="absolute top-4 right-4 bg-slate-900/90 p-3 rounded text-sm max-w-xs">
            <h4 className="font-semibold text-yellow-400 mb-2">Controls</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• Click and drag to rotate</li>
              <li>• Scroll to zoom</li>
              <li>• Click events for details</li>
              <li>• Hover for quick info</li>
              <li>• Use filters to focus</li>
            </ul>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 p-3 rounded text-sm">
            <h4 className="font-semibold text-yellow-400 mb-2">Evidence Types</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(EVIDENCE_ICONS).map(([type, icon]) => (
                <div key={type} className="flex items-center">
                  <span className="mr-1">{icon}</span>
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}