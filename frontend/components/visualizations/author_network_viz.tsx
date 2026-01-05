import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface AuthorNode {
  id: string;
  name: string;
  dates: string;
  genre: 'philosophy' | 'poetry' | 'history' | 'drama' | 'rhetoric' | 'science';
  language: 'greek' | 'latin';
  influence: number;
  works: string[];
  x?: number;
  y?: number;
  z?: number;
}

interface AuthorLink {
  source: string;
  target: string;
  type: 'influenced' | 'contemporary' | 'responded_to' | 'student_of';
  strength: number;
}

interface AuthorNetworkData {
  nodes: AuthorNode[];
  links: AuthorLink[];
}

// Sample classical author network
const SAMPLE_AUTHOR_DATA: AuthorNetworkData = {
  nodes: [
    { id: 'homer', name: 'Homer', dates: 'c. 8th century BCE', genre: 'poetry', language: 'greek', influence: 10, works: ['Iliad', 'Odyssey'] },
    { id: 'hesiod', name: 'Hesiod', dates: 'c. 700 BCE', genre: 'poetry', language: 'greek', influence: 7, works: ['Theogony', 'Works and Days'] },
    { id: 'herodotus', name: 'Herodotus', dates: '484-425 BCE', genre: 'history', language: 'greek', influence: 8, works: ['Histories'] },
    { id: 'thucydides', name: 'Thucydides', dates: '460-400 BCE', genre: 'history', language: 'greek', influence: 9, works: ['History of the Peloponnesian War'] },
    { id: 'socrates', name: 'Socrates', dates: '470-399 BCE', genre: 'philosophy', language: 'greek', influence: 10, works: ['(Known through Plato)'] },
    { id: 'plato', name: 'Plato', dates: '428-348 BCE', genre: 'philosophy', language: 'greek', influence: 10, works: ['Republic', 'Symposium', 'Phaedo'] },
    { id: 'aristotle', name: 'Aristotle', dates: '384-322 BCE', genre: 'philosophy', language: 'greek', influence: 10, works: ['Nicomachean Ethics', 'Politics', 'Poetics'] },
    { id: 'sophocles', name: 'Sophocles', dates: '496-406 BCE', genre: 'drama', language: 'greek', influence: 9, works: ['Oedipus Rex', 'Antigone'] },
    { id: 'euripides', name: 'Euripides', dates: '480-406 BCE', genre: 'drama', language: 'greek', influence: 8, works: ['Medea', 'Bacchae'] },
    { id: 'cicero', name: 'Cicero', dates: '106-43 BCE', genre: 'rhetoric', language: 'latin', influence: 9, works: ['De Oratore', 'De Officiis'] },
    { id: 'virgil', name: 'Virgil', dates: '70-19 BCE', genre: 'poetry', language: 'latin', influence: 10, works: ['Aeneid', 'Georgics', 'Eclogues'] },
    { id: 'horace', name: 'Horace', dates: '65-8 BCE', genre: 'poetry', language: 'latin', influence: 8, works: ['Odes', 'Satires', 'Ars Poetica'] },
    { id: 'ovid', name: 'Ovid', dates: '43 BCE-17 CE', genre: 'poetry', language: 'latin', influence: 8, works: ['Metamorphoses', 'Ars Amatoria'] },
    { id: 'seneca', name: 'Seneca', dates: '4 BCE-65 CE', genre: 'philosophy', language: 'latin', influence: 8, works: ['Letters', 'Moral Essays'] },
    { id: 'marcus', name: 'Marcus Aurelius', dates: '121-180 CE', genre: 'philosophy', language: 'greek', influence: 8, works: ['Meditations'] },
  ],
  links: [
    { source: 'socrates', target: 'plato', type: 'student_of', strength: 1 },
    { source: 'plato', target: 'aristotle', type: 'student_of', strength: 1 },
    { source: 'homer', target: 'virgil', type: 'influenced', strength: 0.9 },
    { source: 'homer', target: 'hesiod', type: 'contemporary', strength: 0.6 },
    { source: 'plato', target: 'cicero', type: 'influenced', strength: 0.8 },
    { source: 'aristotle', target: 'cicero', type: 'influenced', strength: 0.8 },
    { source: 'herodotus', target: 'thucydides', type: 'influenced', strength: 0.7 },
    { source: 'sophocles', target: 'euripides', type: 'contemporary', strength: 0.7 },
    { source: 'virgil', target: 'horace', type: 'contemporary', strength: 0.8 },
    { source: 'virgil', target: 'ovid', type: 'influenced', strength: 0.7 },
    { source: 'cicero', target: 'seneca', type: 'influenced', strength: 0.8 },
    { source: 'seneca', target: 'marcus', type: 'influenced', strength: 0.9 },
    { source: 'plato', target: 'seneca', type: 'influenced', strength: 0.7 },
    { source: 'aristotle', target: 'marcus', type: 'influenced', strength: 0.6 },
  ]
};

// Simple force simulation for author network
const runAuthorSimulation = (nodes: AuthorNode[], links: AuthorLink[]): AuthorNode[] => {
  const simulatedNodes = nodes.map(n => ({
    ...n,
    x: (Math.random() - 0.5) * 15,
    y: (Math.random() - 0.5) * 15,
    z: (Math.random() - 0.5) * 5,
  }));

  for (let i = 0; i < 150; i++) {
    for (let j = 0; j < simulatedNodes.length; j++) {
      for (let k = j + 1; k < simulatedNodes.length; k++) {
        const dx = simulatedNodes[k].x! - simulatedNodes[j].x!;
        const dy = simulatedNodes[k].y! - simulatedNodes[j].y!;
        const dz = simulatedNodes[k].z! - simulatedNodes[j].z!;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.1;
        const force = 3 / (dist * dist);
        simulatedNodes[j].x! -= (dx / dist) * force;
        simulatedNodes[j].y! -= (dy / dist) * force;
        simulatedNodes[j].z! -= (dz / dist) * force * 0.3;
        simulatedNodes[k].x! += (dx / dist) * force;
        simulatedNodes[k].y! += (dy / dist) * force;
        simulatedNodes[k].z! += (dz / dist) * force * 0.3;
      }
    }

    for (const link of links) {
      const source = simulatedNodes.find(n => n.id === link.source);
      const target = simulatedNodes.find(n => n.id === link.target);
      if (source && target) {
        const dx = target.x! - source.x!;
        const dy = target.y! - source.y!;
        const dz = target.z! - source.z!;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.1;
        const force = (dist - 4) * 0.08 * link.strength;
        source.x! += (dx / dist) * force;
        source.y! += (dy / dist) * force;
        source.z! += (dz / dist) * force * 0.3;
        target.x! -= (dx / dist) * force;
        target.y! -= (dy / dist) * force;
        target.z! -= (dz / dist) * force * 0.3;
      }
    }
  }

  return simulatedNodes;
};

interface AuthorNodeMeshProps {
  node: AuthorNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const AuthorNodeMesh: React.FC<AuthorNodeMeshProps> = ({ node, isSelected, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const getGenreColor = () => {
    switch (node.genre) {
      case 'philosophy': return '#C9A962';
      case 'poetry': return '#7C9885';
      case 'history': return '#8B7355';
      case 'drama': return '#6B8E9B';
      case 'rhetoric': return '#9B6B8E';
      case 'science': return '#8E9B6B';
      default: return '#C9A962';
    }
  };

  const getLanguageShape = () => node.language === 'greek' ? 'sphere' : 'box';
  const size = 0.4 + (node.influence / 10) * 0.5;

  useFrame((state) => {
    if (meshRef.current && (hovered || isSelected)) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.15);
    }
  });

  return (
    <group position={[node.x || 0, node.y || 0, node.z || 0]}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(node.id)}
      >
        {getLanguageShape() === 'sphere' ? (
          <sphereGeometry args={[size, 32, 32]} />
        ) : (
          <boxGeometry args={[size * 1.5, size * 1.5, size * 1.5]} />
        )}
        <meshStandardMaterial
          color={getGenreColor()}
          emissive={getGenreColor()}
          emissiveIntensity={hovered || isSelected ? 0.8 : 0.3}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      {/* Glow */}
      <Sphere args={[size * 1.4, 16, 16]}>
        <meshBasicMaterial color={getGenreColor()} transparent opacity={hovered || isSelected ? 0.25 : 0.08} />
      </Sphere>
      {(hovered || isSelected) && (
        <Html position={[0, size + 0.8, 0]} center>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0D0D0F]/95 border border-[#C9A962]/50 rounded-lg p-4 shadow-xl min-w-[200px] max-w-[280px]"
          >
            <div className="text-[#C9A962] font-serif text-lg font-bold">{node.name}</div>
            <div className="text-[#F5F3EF]/60 text-xs mb-2">{node.dates}</div>
            <div className="flex gap-2 mb-2">
              <span className="px-2 py-0.5 bg-white/10 text-[#F5F3EF]/80 text-xs rounded capitalize">{node.genre}</span>
              <span className="px-2 py-0.5 bg-white/10 text-[#F5F3EF]/80 text-xs rounded capitalize">{node.language}</span>
            </div>
            <div className="text-[#7C9885] text-xs">
              <div className="font-medium mb-1">Major Works:</div>
              <div className="text-[#F5F3EF]/60">{node.works.join(', ')}</div>
            </div>
          </motion.div>
        </Html>
      )}
    </group>
  );
};

interface AuthorNetworkProps {
  data?: AuthorNetworkData;
  className?: string;
}

const AuthorNetwork: React.FC<AuthorNetworkProps> = ({
  data = SAMPLE_AUTHOR_DATA,
  className = ''
}) => {
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  const simulatedNodes = useMemo(() => runAuthorSimulation(data.nodes, data.links), [data]);

  const filteredNodes = useMemo(() => {
    return simulatedNodes.filter(n => {
      const genreMatch = genreFilter === 'all' || n.genre === genreFilter;
      const langMatch = languageFilter === 'all' || n.language === languageFilter;
      return genreMatch && langMatch;
    });
  }, [simulatedNodes, genreFilter, languageFilter]);

  const filteredLinks = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return data.links.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));
  }, [data.links, filteredNodes]);

  const getLinkColor = (type: string) => {
    switch (type) {
      case 'student_of': return '#C9A962';
      case 'influenced': return '#7C9885';
      case 'contemporary': return '#8B7355';
      case 'responded_to': return '#6B8E9B';
      default: return '#C9A962';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`relative w-full h-full min-h-[600px] ${className}`}
    >
      <Canvas
        camera={{ position: [0, 0, 25], fov: 50 }}
        style={{ background: 'linear-gradient(180deg, #0D0D0F 0%, #1a1a2e 100%)' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[15, 15, 15]} intensity={0.8} color="#C9A962" />
        <pointLight position={[-15, -15, -15]} intensity={0.5} color="#7C9885" />

        {/* Links */}
        {filteredLinks.map((link, idx) => {
          const source = simulatedNodes.find(n => n.id === link.source);
          const target = simulatedNodes.find(n => n.id === link.target);
          if (!source || !target) return null;
          return (
            <Line
              key={idx}
              points={[
                [source.x || 0, source.y || 0, source.z || 0],
                [target.x || 0, target.y || 0, target.z || 0]
              ]}
              color={getLinkColor(link.type)}
              lineWidth={link.strength * 2.5}
              transparent
              opacity={0.4}
            />
          );
        })}

        {/* Author Nodes */}
        {filteredNodes.map(node => (
          <AuthorNodeMesh
            key={node.id}
            node={node}
            isSelected={selectedAuthor === node.id}
            onSelect={setSelectedAuthor}
          />
        ))}

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={!selectedAuthor}
          autoRotateSpeed={0.3}
        />
      </Canvas>

      {/* Filters */}
      <div className="absolute bottom-4 left-4 bg-[#0D0D0F]/90 border border-white/10 rounded-lg p-4 space-y-4">
        <div>
          <div className="text-[#F5F3EF] text-sm font-medium mb-2">Genre</div>
          <div className="flex flex-wrap gap-1">
            {['all', 'philosophy', 'poetry', 'history', 'drama', 'rhetoric'].map(genre => (
              <button
                key={genre}
                onClick={() => setGenreFilter(genre)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  genreFilter === genre ? 'bg-[#C9A962]/20 text-[#C9A962]' : 'text-[#F5F3EF]/60 hover:text-[#F5F3EF]'
                }`}
              >
                {genre === 'all' ? 'All' : genre}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[#F5F3EF] text-sm font-medium mb-2">Language</div>
          <div className="flex gap-2">
            {['all', 'greek', 'latin'].map(lang => (
              <button
                key={lang}
                onClick={() => setLanguageFilter(lang)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  languageFilter === lang ? 'bg-[#C9A962]/20 text-[#C9A962]' : 'text-[#F5F3EF]/60 hover:text-[#F5F3EF]'
                }`}
              >
                {lang === 'all' ? 'All' : lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-[#0D0D0F]/90 border border-white/10 rounded-lg p-4">
        <div className="text-[#F5F3EF] text-sm font-medium mb-2">Connection Types</div>
        <div className="space-y-1">
          {[
            { type: 'student_of', label: 'Student of', color: '#C9A962' },
            { type: 'influenced', label: 'Influenced', color: '#7C9885' },
            { type: 'contemporary', label: 'Contemporary', color: '#8B7355' },
          ].map(item => (
            <div key={item.type} className="flex items-center gap-2">
              <div className="w-4 h-0.5" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-[#F5F3EF]/60">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="absolute top-4 right-4 bg-[#0D0D0F]/90 border border-white/10 rounded-lg p-4">
        <div className="text-[#C9A962] text-2xl font-bold">{filteredNodes.length}</div>
        <div className="text-[#F5F3EF]/60 text-xs">Classical Authors</div>
        <div className="text-[#7C9885] text-lg font-bold mt-2">{filteredLinks.length}</div>
        <div className="text-[#F5F3EF]/60 text-xs">Connections</div>
      </div>
    </motion.div>
  );
};

export default AuthorNetwork;
