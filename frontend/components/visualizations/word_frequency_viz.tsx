import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

// Define the type for word frequency data
interface WordFrequencyData {
  word: string;
  frequency: number;
  time: Date;
}

// Sample data
const data: WordFrequencyData[] = [
  { word: 'example', frequency: 10, time: new Date('2023-01-01') },
  // Add more data points here
];

// Heatmap component
const Heatmap: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  // D3 scale for color
  const colorScale = d3.scaleSequential(d3.interpolateYlOrBr)
    .domain(d3.extent(data, d => d.frequency) as [number, number]);

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? '#C9A962' : '#0D0D0F'} />
      <Html position={[0, 0.5, 0]}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          style={{ color: '#C9A962', fontSize: '12px' }}
        >
          Hovered!
        </motion.div>
      </Html>
    </mesh>
  );
};

// Main visualization component
const WordFrequencyVisualization: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ background: '#0D0D0F' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Heatmap />
      {/* Add more components for drill-down and time series visualization */}
    </Canvas>
  );
};

export default WordFrequencyVisualization;
