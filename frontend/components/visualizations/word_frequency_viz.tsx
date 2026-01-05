import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

interface WordFrequencyData {
  word: string;
  translation: string;
  frequency: number;
  period: string;
  color?: string;
}

// Comprehensive sample data for classical languages
const SAMPLE_DATA: WordFrequencyData[] = [
  { word: 'λόγος', translation: 'logos/word', frequency: 847, period: 'Classical' },
  { word: 'ἀρετή', translation: 'virtue', frequency: 623, period: 'Classical' },
  { word: 'virtus', translation: 'virtue', frequency: 589, period: 'Republic' },
  { word: 'φιλοσοφία', translation: 'philosophy', frequency: 445, period: 'Hellenistic' },
  { word: 'ψυχή', translation: 'soul', frequency: 512, period: 'Classical' },
  { word: 'anima', translation: 'soul', frequency: 478, period: 'Imperial' },
  { word: 'δικαιοσύνη', translation: 'justice', frequency: 389, period: 'Classical' },
  { word: 'pietas', translation: 'piety', frequency: 356, period: 'Republic' },
  { word: 'σοφία', translation: 'wisdom', frequency: 423, period: 'Classical' },
  { word: 'gloria', translation: 'glory', frequency: 412, period: 'Republic' },
  { word: 'ἀλήθεια', translation: 'truth', frequency: 378, period: 'Classical' },
  { word: 'fides', translation: 'faith', frequency: 345, period: 'Imperial' },
  { word: 'νοῦς', translation: 'mind', frequency: 367, period: 'Classical' },
  { word: 'ratio', translation: 'reason', frequency: 398, period: 'Republic' },
  { word: 'εὐδαιμονία', translation: 'happiness', frequency: 289, period: 'Hellenistic' },
  { word: 'felicitas', translation: 'fortune', frequency: 267, period: 'Imperial' },
];

interface HeatmapCellProps {
  data: WordFrequencyData;
  position: [number, number, number];
  maxFrequency: number;
  colorScale: d3.ScaleSequential<string>;
  index: number;
}

const HeatmapCell: React.FC<HeatmapCellProps> = ({ data, position, maxFrequency, colorScale, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const height = (data.frequency / maxFrequency) * 2 + 0.2;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime + index * 0.3) * 0.05 + height / 2;
    }
  });

  const color = colorScale(data.frequency);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? [1.1, 1, 1.1] : [1, 1, 1]}
      >
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial
          color={hovered ? '#C9A962' : color}
          emissive={hovered ? '#C9A962' : color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      {hovered && (
        <Html position={[0, height + 0.5, 0]} center>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0D0D0F]/95 border border-[#C9A962]/50 rounded-lg p-3 shadow-xl min-w-[150px]"
          >
            <div className="text-[#C9A962] font-serif text-lg">{data.word}</div>
            <div className="text-[#F5F3EF]/80 text-sm">{data.translation}</div>
            <div className="text-[#7C9885] text-xs mt-1">
              {data.frequency} occurrences • {data.period}
            </div>
          </motion.div>
        </Html>
      )}
    </group>
  );
};

const HeatmapGrid: React.FC<{ data: WordFrequencyData[] }> = ({ data }) => {
  const maxFrequency = useMemo(() => Math.max(...data.map(d => d.frequency)), [data]);
  const colorScale = useMemo(
    () => d3.scaleSequential(d3.interpolateViridis).domain([0, maxFrequency]),
    [maxFrequency]
  );

  const gridSize = Math.ceil(Math.sqrt(data.length));

  return (
    <group>
      {data.map((item, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const x = (col - gridSize / 2) * 1.2;
        const z = (row - gridSize / 2) * 1.2;

        return (
          <HeatmapCell
            key={item.word}
            data={item}
            position={[x, 0, z]}
            maxFrequency={maxFrequency}
            colorScale={colorScale}
            index={index}
          />
        );
      })}
      {/* Base platform */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[gridSize * 1.4, gridSize * 1.4]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.8} />
      </mesh>
    </group>
  );
};

interface WordFrequencyVisualizationProps {
  data?: WordFrequencyData[];
  className?: string;
}

const WordFrequencyVisualization: React.FC<WordFrequencyVisualizationProps> = ({
  data = SAMPLE_DATA,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`w-full h-full min-h-[500px] ${className}`}
    >
      <Canvas
        camera={{ position: [8, 6, 8], fov: 50 }}
        style={{ background: 'linear-gradient(180deg, #0D0D0F 0%, #1a1a2e 100%)' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#C9A962" />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#7C9885" />
        <spotLight position={[0, 15, 0]} intensity={0.8} angle={0.6} penumbra={0.5} />
        <HeatmapGrid data={data} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </motion.div>
  );
};

export default WordFrequencyVisualization;
