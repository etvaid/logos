import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface HistoricalEvent {
  id: string;
  date: Date;
  label: string;
  description: string;
  category: 'literary' | 'political' | 'philosophical' | 'cultural';
  author?: string;
}

interface HistoricalPeriod {
  id: string;
  start: Date;
  end: Date;
  label: string;
  color: string;
}

// Sample classical world events
const SAMPLE_EVENTS: HistoricalEvent[] = [
  { id: 'homer', date: new Date(-800, 0, 1), label: 'Homer composes epics', description: 'Composition of Iliad and Odyssey', category: 'literary', author: 'Homer' },
  { id: 'solon', date: new Date(-594, 0, 1), label: 'Solon\'s reforms', description: 'Democratic reforms in Athens', category: 'political' },
  { id: 'aeschylus', date: new Date(-525, 0, 1), label: 'Aeschylus born', description: 'Father of tragedy', category: 'literary', author: 'Aeschylus' },
  { id: 'sophocles', date: new Date(-496, 0, 1), label: 'Sophocles born', description: 'Master of Attic tragedy', category: 'literary', author: 'Sophocles' },
  { id: 'pericles', date: new Date(-461, 0, 1), label: 'Age of Pericles begins', description: 'Golden Age of Athens', category: 'political' },
  { id: 'herodotus', date: new Date(-484, 0, 1), label: 'Herodotus born', description: 'Father of History', category: 'literary', author: 'Herodotus' },
  { id: 'socrates', date: new Date(-470, 0, 1), label: 'Socrates born', description: 'Founder of Western philosophy', category: 'philosophical', author: 'Socrates' },
  { id: 'plato', date: new Date(-428, 0, 1), label: 'Plato born', description: 'Founded the Academy', category: 'philosophical', author: 'Plato' },
  { id: 'aristotle', date: new Date(-384, 0, 1), label: 'Aristotle born', description: 'Universal genius', category: 'philosophical', author: 'Aristotle' },
  { id: 'alexander', date: new Date(-356, 0, 1), label: 'Alexander born', description: 'Conquers known world', category: 'political' },
  { id: 'cicero', date: new Date(-106, 0, 1), label: 'Cicero born', description: 'Greatest Roman orator', category: 'literary', author: 'Cicero' },
  { id: 'caesar', date: new Date(-100, 0, 1), label: 'Caesar born', description: 'Dictator and author', category: 'political', author: 'Julius Caesar' },
  { id: 'virgil', date: new Date(-70, 0, 1), label: 'Virgil born', description: 'Author of Aeneid', category: 'literary', author: 'Virgil' },
  { id: 'horace', date: new Date(-65, 0, 1), label: 'Horace born', description: 'Master of lyric poetry', category: 'literary', author: 'Horace' },
  { id: 'ovid', date: new Date(-43, 0, 1), label: 'Ovid born', description: 'Metamorphoses poet', category: 'literary', author: 'Ovid' },
  { id: 'seneca', date: new Date(-4, 0, 1), label: 'Seneca born', description: 'Stoic philosopher', category: 'philosophical', author: 'Seneca' },
  { id: 'marcus', date: new Date(121, 0, 1), label: 'Marcus Aurelius born', description: 'Philosopher emperor', category: 'philosophical', author: 'Marcus Aurelius' },
];

const SAMPLE_PERIODS: HistoricalPeriod[] = [
  { id: 'archaic', start: new Date(-800, 0, 1), end: new Date(-480, 0, 1), label: 'Archaic Period', color: '#8B7355' },
  { id: 'classical', start: new Date(-480, 0, 1), end: new Date(-323, 0, 1), label: 'Classical Period', color: '#C9A962' },
  { id: 'hellenistic', start: new Date(-323, 0, 1), end: new Date(-31, 0, 1), label: 'Hellenistic Period', color: '#7C9885' },
  { id: 'roman', start: new Date(-31, 0, 1), end: new Date(284, 0, 1), label: 'Roman Imperial', color: '#6B8E9B' },
];

interface EventMarkerProps {
  event: HistoricalEvent;
  position: [number, number, number];
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const EventMarker: React.FC<EventMarkerProps> = ({ event, position, isSelected, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const getCategoryColor = () => {
    switch (event.category) {
      case 'literary': return '#C9A962';
      case 'political': return '#7C9885';
      case 'philosophical': return '#8B7355';
      case 'cultural': return '#6B8E9B';
      default: return '#C9A962';
    }
  };

  useFrame((state) => {
    if (meshRef.current) {
      const scale = hovered || isSelected ? 1.5 : 1;
      meshRef.current.scale.setScalar(scale);
      if (hovered || isSelected) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      }
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(event.id)}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color={getCategoryColor()}
          emissive={getCategoryColor()}
          emissiveIntensity={hovered || isSelected ? 0.8 : 0.3}
        />
      </mesh>
      {(hovered || isSelected) && (
        <Html position={[0, 0.5, 0]} center>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0D0D0F]/95 border border-[#C9A962]/50 rounded-lg p-3 shadow-xl min-w-[180px]"
          >
            <div className="text-[#C9A962] font-serif text-sm font-bold">{event.label}</div>
            <div className="text-[#F5F3EF]/60 text-xs mt-1">{event.date.getFullYear()} BCE</div>
            <div className="text-[#F5F3EF]/80 text-xs mt-2">{event.description}</div>
            {event.author && (
              <div className="text-[#7C9885] text-xs mt-1">Author: {event.author}</div>
            )}
          </motion.div>
        </Html>
      )}
    </group>
  );
};

interface TimelineVisualizationProps {
  events?: HistoricalEvent[];
  periods?: HistoricalPeriod[];
  className?: string;
}

const TimelineVisualization: React.FC<TimelineVisualizationProps> = ({
  events = SAMPLE_EVENTS,
  periods = SAMPLE_PERIODS,
  className = ''
}) => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const timeScale = useMemo(() => {
    const allDates = events.map(e => e.date);
    const minDate = d3.min(allDates) || new Date(-800, 0, 1);
    const maxDate = d3.max(allDates) || new Date(300, 0, 1);
    return d3.scaleTime().domain([minDate, maxDate]).range([-8, 8]);
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (categoryFilter === 'all') return events;
    return events.filter(e => e.category === categoryFilter);
  }, [events, categoryFilter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`relative w-full h-full min-h-[500px] ${className}`}
    >
      <Canvas
        camera={{ position: [0, 5, 12], fov: 50 }}
        style={{ background: 'linear-gradient(180deg, #0D0D0F 0%, #1a1a2e 100%)' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#C9A962" />
        <pointLight position={[-10, 5, -5]} intensity={0.5} color="#7C9885" />

        {/* Timeline base line */}
        <Line
          points={[[-10, 0, 0], [10, 0, 0]]}
          color="#C9A962"
          lineWidth={2}
        />

        {/* Period bands */}
        {periods.map(period => {
          const startX = timeScale(period.start);
          const endX = timeScale(period.end);
          const width = endX - startX;
          const centerX = (startX + endX) / 2;

          return (
            <group key={period.id}>
              <mesh position={[centerX, -0.5, 0]}>
                <boxGeometry args={[width, 0.3, 0.5]} />
                <meshStandardMaterial color={period.color} transparent opacity={0.3} />
              </mesh>
              <Html position={[centerX, -1, 0]} center>
                <div className="text-[#F5F3EF]/60 text-xs whitespace-nowrap">{period.label}</div>
              </Html>
            </group>
          );
        })}

        {/* Event markers */}
        {filteredEvents.map((event, index) => {
          const x = timeScale(event.date);
          const y = 0.5 + (index % 3) * 0.5; // Stagger heights
          return (
            <EventMarker
              key={event.id}
              event={event}
              position={[x, y, 0]}
              isSelected={selectedEvent === event.id}
              onSelect={setSelectedEvent}
            />
          );
        })}

        {/* Year markers */}
        {[-800, -600, -400, -200, 0, 200].map(year => {
          const x = timeScale(new Date(year, 0, 1));
          return (
            <group key={year}>
              <Line points={[[x, -0.2, 0], [x, 0.2, 0]]} color="#C9A962" lineWidth={1} />
              <Html position={[x, -0.8, 0]} center>
                <div className="text-[#C9A962]/60 text-xs">{year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`}</div>
              </Html>
            </group>
          );
        })}

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {/* Category Filter */}
      <div className="absolute top-4 left-4 bg-[#0D0D0F]/90 border border-white/10 rounded-lg p-4">
        <div className="text-[#F5F3EF] text-sm font-medium mb-3">Filter by Category</div>
        <div className="space-y-2">
          {['all', 'literary', 'political', 'philosophical'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`flex items-center gap-2 w-full px-2 py-1 rounded transition-colors ${
                categoryFilter === cat ? 'bg-[#C9A962]/20 text-[#C9A962]' : 'text-[#F5F3EF]/60 hover:text-[#F5F3EF]'
              }`}
            >
              <span className="text-xs capitalize">{cat === 'all' ? 'All Events' : cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="absolute top-4 right-4 bg-[#0D0D0F]/90 border border-white/10 rounded-lg p-4">
        <div className="text-[#C9A962] text-2xl font-bold">{filteredEvents.length}</div>
        <div className="text-[#F5F3EF]/60 text-xs">Historical Events</div>
      </div>
    </motion.div>
  );
};

export default TimelineVisualization;
