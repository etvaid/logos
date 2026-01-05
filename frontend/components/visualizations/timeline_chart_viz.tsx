import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface Event {
  date: Date;
  label: string;
}

interface Period {
  start: Date;
  end: Date;
  label: string;
}

interface TimelineChartProps {
  events: Event[];
  periods: Period[];
}

const TimelineChart: React.FC<TimelineChartProps> = ({ events, periods }) => {
  const [scale, setScale] = useState<d3.ScaleTime<number, number>>(() => d3.scaleTime());
  const timelineRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const minDate = d3.min(events, (d) => d.date) || new Date();
    const maxDate = d3.max(events, (d) => d.date) || new Date();
    setScale(d3.scaleTime().domain([minDate, maxDate]).range([-5, 5]));
  }, [events]);

  useFrame(() => {
    if (timelineRef.current) {
      // Update logic for animations or interactions
    }
  });

  return (
    <motion.div
      style={{ width: '100vw', height: '100vh', backgroundColor: '#0D0D0F' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <OrbitControls enableZoom enablePan enableRotate />
        <ambientLight intensity={0.5} />
        <group ref={timelineRef}>
          {events.map((event, index) => (
            <mesh key={index} position={[scale(event.date), 0, 0]}>
              <sphereGeometry args={[0.1, 32, 32]} />
              <meshStandardMaterial color="#C9A962" />
            </mesh>
          ))}
          {periods.map((period, index) => (
            <mesh key={index} position={[(scale(period.start) + scale(period.end)) / 2, 0, 0]}>
              <boxGeometry args={[scale(period.end) - scale(period.start), 0.1, 0.1]} />
              <meshStandardMaterial color="#C9A962" opacity={0.5} transparent />
            </mesh>
          ))}
        </group>
      </Canvas>
    </motion.div>
  );
};

export default TimelineChart;
