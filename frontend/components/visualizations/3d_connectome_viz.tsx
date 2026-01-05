import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface ConceptNode {
  id: string;
  label: string;
  greekLabel?: string;
  latinLabel?: string;
  category: 'virtue' | 'metaphysics' | 'ethics' | 'politics' | 'logic' | 'aesthetics';
  importance: number;
  x?: number;
  y?: number;
  z?: number;
}

interface ConceptLink {
  source: string;
  target: string;
  strength: number;
  relationship: string;
}

interface GraphData {
  nodes: ConceptNode[];
  links: ConceptLink[];
}

// Sample philosophical concept network
const SAMPLE_GRAPH_DATA: GraphData = {
  nodes: [
    { id: 'arete', label: 'Virtue', greekLabel: 'ἀρετή', category: 'virtue', importance: 10 },
    { id: 'sophia', label: 'Wisdom', greekLabel: 'σοφία', category: 'virtue', importance: 9 },
    { id: 'phronesis', label: 'Practical Wisdom', greekLabel: 'φρόνησις', category: 'ethics', importance: 9 },
    { id: 'dikaiosyne', label: 'Justice', greekLabel: 'δικαιοσύνη', category: 'politics', importance: 10 },
    { id: 'andreia', label: 'Courage', greekLabel: 'ἀνδρεία', category: 'virtue', importance: 7 },
    { id: 'sophrosyne', label: 'Temperance', greekLabel: 'σωφροσύνη', category: 'virtue', importance: 7 },
    { id: 'eudaimonia', label: 'Flourishing', greekLabel: 'εὐδαιμονία', category: 'ethics', importance: 10 },
    { id: 'logos', label: 'Reason', greekLabel: 'λόγος', category: 'logic', importance: 10 },
    { id: 'psyche', label: 'Soul', greekLabel: 'ψυχή', category: 'metaphysics', importance: 9 },
    { id: 'nous', label: 'Intellect', greekLabel: 'νοῦς', category: 'metaphysics', importance: 8 },
    { id: 'kalon', label: 'Beauty', greekLabel: 'τὸ καλόν', category: 'aesthetics', importance: 7 },
    { id: 'aletheia', label: 'Truth', greekLabel: 'ἀλήθεια', category: 'logic', importance: 9 },
    { id: 'polis', label: 'City-State', greekLabel: 'πόλις', category: 'politics', importance: 8 },
    { id: 'nomos', label: 'Law', greekLabel: 'νόμος', category: 'politics', importance: 7 },
    { id: 'physis', label: 'Nature', greekLabel: 'φύσις', category: 'metaphysics', importance: 8 },
  ],
  links: [
    { source: 'arete', target: 'eudaimonia', strength: 1, relationship: 'leads to' },
    { source: 'sophia', target: 'phronesis', strength: 0.9, relationship: 'includes' },
    { source: 'phronesis', target: 'arete', strength: 0.8, relationship: 'enables' },
    { source: 'logos', target: 'sophia', strength: 0.9, relationship: 'foundation of' },
    { source: 'psyche', target: 'nous', strength: 0.8, relationship: 'contains' },
    { source: 'nous', target: 'aletheia', strength: 0.7, relationship: 'perceives' },
    { source: 'dikaiosyne', target: 'polis', strength: 0.9, relationship: 'governs' },
    { source: 'nomos', target: 'dikaiosyne', strength: 0.7, relationship: 'enforces' },
    { source: 'kalon', target: 'arete', strength: 0.6, relationship: 'manifests' },
    { source: 'eudaimonia', target: 'psyche', strength: 0.8, relationship: 'state of' },
    { source: 'physis', target: 'logos', strength: 0.7, relationship: 'ordered by' },
    { source: 'sophrosyne', target: 'psyche', strength: 0.7, relationship: 'balances' },
    { source: 'andreia', target: 'arete', strength: 0.8, relationship: 'component of' },
    { source: 'aletheia', target: 'sophia', strength: 0.8, relationship: 'object of' },
  ]
};

// Simple force simulation
const runSimulation = (nodes: ConceptNode[], links: ConceptLink[]): ConceptNode[] => {
  const simulatedNodes = nodes.map(n => ({
    ...n,
    x: (Math.random() - 0.5) * 10,
    y: (Math.random() - 0.5) * 10,
    z: (Math.random() - 0.5) * 10,
  }));

  // Simple force iterations
  for (let i = 0; i < 100; i++) {
    // Repulsion between all nodes
    for (let j = 0; j < simulatedNodes.length; j++) {
      for (let k = j + 1; k < simulatedNodes.length; k++) {
        const dx = simulatedNodes[k].x! - simulatedNodes[j].x!;
        const dy = simulatedNodes[k].y! - simulatedNodes[j].y!;
        const dz = simulatedNodes[k].z! - simulatedNodes[j].z!;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.1;
        const force = 2 / (dist * dist);
        simulatedNodes[j].x! -= (dx / dist) * force;
        simulatedNodes[j].y! -= (dy / dist) * force;
        simulatedNodes[j].z! -= (dz / dist) * force;
        simulatedNodes[k].x! += (dx / dist) * force;
        simulatedNodes[k].y! += (dy / dist) * force;
        simulatedNodes[k].z! += (dz / dist) * force;
      }
    }

    // Attraction along links
    for (const link of links) {
      const source = simulatedNodes.find(n => n.id === link.source);
      const target = simulatedNodes.find(n => n.id === link.target);
      if (source && target) {
        const dx = target.x! - source.x!;
        const dy = target.y! - source.y!;
        const dz = target.z! - source.z!;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.1;
        const force = (dist - 3) * 0.1 * link.strength;
        source.x! += (dx / dist) * force;
        source.y! += (dy / dist) * force;
        source.z! += (dz / dist) * force;
        target.x! -= (dx / dist) * force;
        target.y! -= (dy / dist) * force;
        target.z! -= (dz / dist) * force;
      }
    }
  }

  return simulatedNodes;
};

interface NodeMeshProps {
  node: ConceptNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const NodeMesh: React.FC<NodeMeshProps> = ({ node, isSelected, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const getCategoryColor = () => {
    switch (node.category) {
      case 'virtue': return '#C9A962';
      case 'ethics': return '#7C9885';
      case 'metaphysics': return '#8B7355';
      case 'politics': return '#6B8E9B';
      case 'logic': return '#9B6B8E';
      case 'aesthetics': return '#8E9B6B';
      default: return '#C9A962';
    }
  };

  const size = 0.3 + (node.importance / 10) * 0.4;

  useFrame((state) => {
    if (meshRef.current && (hovered || isSelected)) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
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
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={getCategoryColor()}
          emissive={getCategoryColor()}
          emissiveIntensity={hovered || isSelected ? 0.8 : 0.3}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      {/* Glow */}
      <Sphere args={[size * 1.3, 16, 16]}>
        <meshBasicMaterial color={getCategoryColor()} transparent opacity={hovered || isSelected ? 0.2 : 0.05} />
      </Sphere>
      {(hovered || isSelected) && (
        <Html position={[0, size + 0.5, 0]} center>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0D0D0F]/95 border border-[#C9A962]/50 rounded-lg p-3 shadow-xl min-w-[150px]"
          >
            <div className="text-[#C9A962] font-serif text-lg">{node.label}</div>
            {node.greekLabel && <div className="text-[#F5F3EF]/60 text-sm">{node.greekLabel}</div>}
            <div className="text-[#7C9885] text-xs mt-1 capitalize">{node.category}</div>
          </motion.div>
        </Html>
      )}
    </group>
  );
};

interface ConnectomeVisualizationProps {
  data?: GraphData;
  className?: string;
}

const ConnectomeVisualization: React.FC<ConnectomeVisualizationProps> = ({
  data = SAMPLE_GRAPH_DATA,
  className = ''
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const simulatedNodes = useMemo(() => runSimulation(data.nodes, data.links), [data]);

  const filteredNodes = useMemo(() => {
    if (categoryFilter === 'all') return simulatedNodes;
    return simulatedNodes.filter(n => n.category === categoryFilter);
  }, [simulatedNodes, categoryFilter]);

  const filteredLinks = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return data.links.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));
  }, [data.links, filteredNodes]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`relative w-full h-full min-h-[600px] ${className}`}
    >
      <Canvas
        camera={{ position: [0, 0, 20], fov: 50 }}
        style={{ background: 'linear-gradient(180deg, #0D0D0F 0%, #1a1a2e 100%)' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#C9A962" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7C9885" />

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
              color="#C9A962"
              lineWidth={link.strength * 2}
              transparent
              opacity={0.3}
            />
          );
        })}

        {/* Nodes */}
        {filteredNodes.map(node => (
          <NodeMesh
            key={node.id}
            node={node}
            isSelected={selectedNode === node.id}
            onSelect={setSelectedNode}
          />
        ))}

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={!selectedNode}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-[#0D0D0F]/90 border border-white/10 rounded-lg p-4">
        <div className="text-[#F5F3EF] text-sm font-medium mb-3">Concept Categories</div>
        <div className="space-y-2">
          {['all', 'virtue', 'ethics', 'metaphysics', 'politics', 'logic'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`flex items-center gap-2 w-full px-2 py-1 rounded transition-colors ${
                categoryFilter === cat ? 'bg-[#C9A962]/20 text-[#C9A962]' : 'text-[#F5F3EF]/60 hover:text-[#F5F3EF]'
              }`}
            >
              <span className="text-xs capitalize">{cat === 'all' ? 'All Concepts' : cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="absolute top-4 right-4 bg-[#0D0D0F]/90 border border-white/10 rounded-lg p-4">
        <div className="text-[#C9A962] text-2xl font-bold">{filteredNodes.length}</div>
        <div className="text-[#F5F3EF]/60 text-xs">Philosophical Concepts</div>
        <div className="text-[#7C9885] text-lg font-bold mt-2">{filteredLinks.length}</div>
        <div className="text-[#F5F3EF]/60 text-xs">Connections</div>
      </div>
    </motion.div>
  );
};

export default ConnectomeVisualization;
