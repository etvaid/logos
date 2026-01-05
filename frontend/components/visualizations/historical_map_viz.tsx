import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import * as THREE from 'three';

interface LocationMarkerProps {
  position: [number, number, number];
  label: string;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position, label }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color="#C9A962" />
      <Html distanceFactor={10}>
        <div style={{ color: '#C9A962', backgroundColor: '#0D0D0F', padding: '2px 5px', borderRadius: '5px' }}>
          {label}
        </div>
      </Html>
    </mesh>
  );
};

const HistoricalMap: React.FC = () => {
  const [year, setYear] = useState<number>(0);
  const mapRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (mapRef.current) {
      mapRef.current.rotation.y += 0.001;
    }
  });

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(Number(event.target.value));
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0D0D0F' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh ref={mapRef}>
          <sphereGeometry args={[5, 64, 64]} />
          <meshStandardMaterial color={new THREE.Color('#0D0D0F')} wireframe />
        </mesh>
        
        {/* Example location markers */}
        <LocationMarker position={[2, 0, 0]} label="Rome" />
        <LocationMarker position={[-1, 1, 0]} label="Athens" />

        <OrbitControls enableZoom enablePan enableRotate />
      </Canvas>
      
      <div style={{ position: 'absolute', bottom: 20, left: 20, color: '#C9A962' }}>
        <label htmlFor="year-slider">Year: {year}</label>
        <input
          id="year-slider"
          type="range"
          min="0"
          max="2023"
          value={year}
          onChange={handleYearChange}
          style={{ width: '300px' }}
        />
      </div>
    </div>
  );
};

export default HistoricalMap;
