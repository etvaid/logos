import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error d3-force-3d doesn't have type declarations
import * as d3 from 'd3-force-3d';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  group: number;
  // Added by d3-force-3d during simulation
  x?: number;
  y?: number;
  z?: number;
}

interface Link {
  source: string;
  target: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

const Graph3D: React.FC<{ data: GraphData }> = ({ data }) => {
  const { nodes, links } = data;
  const graphRef = useRef<THREE.Group>(null);
  const [positions, setPositions] = useState<{ [key: string]: [number, number, number] }>({});

  useEffect(() => {
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(0, 0, 0))
      .force('collision', d3.forceCollide().radius(20))
      .stop();

    for (let i = 0; i < 300; ++i) simulation.tick();

    const nodePositions: { [key: string]: [number, number, number] } = {};
    nodes.forEach(node => {
      nodePositions[node.id] = [node.x!, node.y!, node.z!];
    });
    setPositions(nodePositions);
  }, [nodes, links]);

  return (
    <group ref={graphRef}>
      {nodes.map(node => (
        <mesh key={node.id} position={positions[node.id]}>
          <sphereGeometry args={[5, 32, 32]} />
          <meshStandardMaterial color={node.group === 1 ? '#C9A962' : '#666666'} />
        </mesh>
      ))}
      {links.map((link, index) => {
        const start = positions[link.source] || [0, 0, 0];
        const end = positions[link.target] || [0, 0, 0];
        const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <primitive key={index} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#C9A962' }))} />
        );
      })}
    </group>
  );
};

const Scene: React.FC<{ data: GraphData }> = ({ data }) => {
  return (
    <Canvas style={{ background: '#0D0D0F', height: '100vh' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Graph3D data={data} />
      <OrbitControls enableZoom enablePan enableRotate />
    </Canvas>
  );
};

const ConnectomeVisualization: React.FC<{ data: GraphData }> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Scene data={data} />
    </motion.div>
  );
};

export default ConnectomeVisualization;
