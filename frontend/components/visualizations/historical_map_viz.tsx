import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface AncientLocation {
  id: string;
  name: string;
  latinName?: string;
  greekName?: string;
  lat: number;
  lng: number;
  type: 'city' | 'region' | 'landmark' | 'library' | 'school';
  period: string;
  significance: string;
  authors?: string[];
}

// Comprehensive ancient world locations
const ANCIENT_LOCATIONS: AncientLocation[] = [
  { id: 'rome', name: 'Rome', latinName: 'Roma', lat: 41.9, lng: 12.5, type: 'city', period: '753 BCE - 476 CE', significance: 'Capital of the Roman Empire', authors: ['Cicero', 'Virgil', 'Horace', 'Ovid'] },
  { id: 'athens', name: 'Athens', greekName: 'Ἀθῆναι', lat: 37.98, lng: 23.73, type: 'city', period: '508 BCE - 322 BCE', significance: 'Birthplace of democracy and philosophy', authors: ['Plato', 'Aristotle', 'Sophocles', 'Euripides'] },
  { id: 'alexandria', name: 'Alexandria', greekName: 'Ἀλεξάνδρεια', lat: 31.2, lng: 29.9, type: 'library', period: '331 BCE - 641 CE', significance: 'Great Library and center of Hellenistic learning', authors: ['Euclid', 'Eratosthenes', 'Philo'] },
  { id: 'sparta', name: 'Sparta', greekName: 'Σπάρτη', lat: 37.08, lng: 22.43, type: 'city', period: '900 BCE - 192 BCE', significance: 'Military power of ancient Greece', authors: ['Tyrtaeus'] },
  { id: 'carthage', name: 'Carthage', latinName: 'Carthago', lat: 36.85, lng: 10.33, type: 'city', period: '814 BCE - 146 BCE', significance: 'Phoenician rival to Rome', authors: ['Terence'] },
  { id: 'constantinople', name: 'Constantinople', greekName: 'Κωνσταντινούπολις', lat: 41.01, lng: 28.98, type: 'city', period: '330 CE - 1453 CE', significance: 'Eastern Roman capital', authors: ['Procopius'] },
  { id: 'pergamon', name: 'Pergamon', greekName: 'Πέργαμον', lat: 39.12, lng: 27.18, type: 'library', period: '281 BCE - 133 BCE', significance: 'Great library rivaling Alexandria', authors: ['Galen'] },
  { id: 'ephesus', name: 'Ephesus', greekName: 'Ἔφεσος', lat: 37.94, lng: 27.34, type: 'city', period: '1000 BCE - 263 CE', significance: 'Temple of Artemis, major port', authors: ['Heraclitus'] },
  { id: 'jerusalem', name: 'Jerusalem', latinName: 'Hierosolyma', lat: 31.77, lng: 35.23, type: 'city', period: '1000 BCE+', significance: 'Holy city, center of Jewish learning', authors: ['Josephus'] },
  { id: 'antioch', name: 'Antioch', greekName: 'Ἀντιόχεια', lat: 36.2, lng: 36.15, type: 'city', period: '300 BCE - 637 CE', significance: 'Third largest city of Roman Empire', authors: ['John Chrysostom'] },
  { id: 'corinth', name: 'Corinth', greekName: 'Κόρινθος', lat: 37.91, lng: 22.88, type: 'city', period: '700 BCE - 146 BCE', significance: 'Major trade center', authors: ['Diogenes'] },
  { id: 'thebes', name: 'Thebes', greekName: 'Θῆβαι', lat: 38.32, lng: 23.32, type: 'city', period: '1600 BCE - 335 BCE', significance: 'Powerful Greek city-state', authors: ['Pindar'] },
  { id: 'delphi', name: 'Delphi', greekName: 'Δελφοί', lat: 38.48, lng: 22.5, type: 'landmark', period: '1400 BCE - 390 CE', significance: 'Oracle of Apollo, sacred site', authors: ['Plutarch'] },
  { id: 'olympia', name: 'Olympia', greekName: 'Ὀλυμπία', lat: 37.64, lng: 21.63, type: 'landmark', period: '776 BCE - 393 CE', significance: 'Site of Olympic Games', authors: [] },
  { id: 'syracuse', name: 'Syracuse', greekName: 'Συράκουσαι', lat: 37.07, lng: 15.29, type: 'city', period: '734 BCE - 212 BCE', significance: 'Greatest Greek city in Sicily', authors: ['Archimedes', 'Theocritus'] },
];

// Convert lat/lng to 3D sphere coordinates
const latLngToVector3 = (lat: number, lng: number, radius: number): [number, number, number] => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
};

interface LocationMarkerProps {
  location: AncientLocation;
  radius: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ location, radius, isSelected, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const position = useMemo(() => latLngToVector3(location.lat, location.lng, radius + 0.1), [location, radius]);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && (hovered || isSelected)) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    }
  });

  const getTypeColor = () => {
    switch (location.type) {
      case 'city': return '#C9A962';
      case 'library': return '#7C9885';
      case 'landmark': return '#8B7355';
      case 'school': return '#6B8E9B';
      case 'region': return '#9B6B8E';
      default: return '#C9A962';
    }
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(location.id)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={getTypeColor()}
          emissive={getTypeColor()}
          emissiveIntensity={hovered || isSelected ? 1 : 0.5}
        />
      </mesh>
      {/* Glow effect */}
      <Sphere args={[0.12, 16, 16]}>
        <meshBasicMaterial color={getTypeColor()} transparent opacity={hovered || isSelected ? 0.3 : 0.1} />
      </Sphere>
      {(hovered || isSelected) && (
        <Html distanceFactor={8} position={[0, 0.2, 0]}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0D0D0F]/95 border border-[#C9A962]/50 rounded-lg p-3 shadow-2xl min-w-[200px] max-w-[280px]"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[#C9A962] font-serif text-lg">{location.name}</div>
              {location.greekName && <span className="text-[#F5F3EF]/60 text-sm">({location.greekName})</span>}
            </div>
            <div className="text-[#7C9885] text-xs mb-2">{location.period}</div>
            <div className="text-[#F5F3EF]/80 text-sm mb-2">{location.significance}</div>
            {location.authors && location.authors.length > 0 && (
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="text-[#8B7355] text-xs mb-1">Notable Authors:</div>
                <div className="flex flex-wrap gap-1">
                  {location.authors.map(author => (
                    <span key={author} className="px-2 py-0.5 bg-[#C9A962]/20 text-[#C9A962] text-xs rounded">
                      {author}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </Html>
      )}
    </group>
  );
};

const Globe: React.FC<{ locations: AncientLocation[]; selectedId: string | null; onSelect: (id: string) => void }> = ({
  locations,
  selectedId,
  onSelect
}) => {
  const globeRef = useRef<THREE.Mesh>(null);
  const radius = 3;

  useFrame(() => {
    if (globeRef.current && !selectedId) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      {/* Globe sphere */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.3}
          roughness={0.8}
          wireframe={false}
        />
      </mesh>
      {/* Atmosphere glow */}
      <Sphere args={[radius + 0.05, 64, 64]}>
        <meshBasicMaterial color="#7C9885" transparent opacity={0.1} side={THREE.BackSide} />
      </Sphere>
      {/* Latitude/Longitude lines */}
      <mesh>
        <sphereGeometry args={[radius + 0.01, 32, 32]} />
        <meshBasicMaterial color="#C9A962" wireframe transparent opacity={0.1} />
      </mesh>
      {/* Location markers */}
      {locations.map(location => (
        <LocationMarker
          key={location.id}
          location={location}
          radius={radius}
          isSelected={selectedId === location.id}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
};

interface HistoricalMapProps {
  locations?: AncientLocation[];
  className?: string;
}

const HistoricalMap: React.FC<HistoricalMapProps> = ({
  locations = ANCIENT_LOCATIONS,
  className = ''
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredLocations = useMemo(() => {
    if (filterType === 'all') return locations;
    return locations.filter(loc => loc.type === filterType);
  }, [locations, filterType]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`relative w-full h-full min-h-[600px] ${className}`}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'linear-gradient(180deg, #0D0D0F 0%, #1a1a2e 50%, #0D0D0F 100%)' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#C9A962" />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#7C9885" />
        <Globe
          locations={filteredLocations}
          selectedId={selectedLocation}
          onSelect={setSelectedLocation}
        />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-[#0D0D0F]/90 border border-white/10 rounded-lg p-4">
        <div className="text-[#F5F3EF] text-sm font-medium mb-3">Location Types</div>
        <div className="space-y-2">
          {['all', 'city', 'library', 'landmark'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex items-center gap-2 w-full px-2 py-1 rounded transition-colors ${
                filterType === type ? 'bg-[#C9A962]/20 text-[#C9A962]' : 'text-[#F5F3EF]/60 hover:text-[#F5F3EF]'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: type === 'all' ? '#C9A962' :
                    type === 'city' ? '#C9A962' :
                    type === 'library' ? '#7C9885' : '#8B7355'
                }}
              />
              <span className="text-xs capitalize">{type === 'all' ? 'All Locations' : type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="absolute top-4 right-4 bg-[#0D0D0F]/90 border border-white/10 rounded-lg p-4">
        <div className="text-[#C9A962] text-2xl font-bold">{filteredLocations.length}</div>
        <div className="text-[#F5F3EF]/60 text-xs">Ancient Locations</div>
      </div>
    </motion.div>
  );
};

export default HistoricalMap;
