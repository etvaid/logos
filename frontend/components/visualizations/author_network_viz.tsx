import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line as DreiLine } from '@react-three/drei';
import * as THREE from 'three';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface AuthorNode extends d3.SimulationNodeDatum {
  id: string;
  genre: string;
  influence: number;
  z?: number;
}

interface AuthorLink {
  source: string | AuthorNode;
  target: string | AuthorNode;
}

interface AuthorNetworkProps {
  nodes: AuthorNode[];
  links: AuthorLink[];
}

const AuthorNetwork: React.FC<AuthorNetworkProps> = ({ nodes, links }) => {
  const [graphData, setGraphData] = useState<{ nodes: AuthorNode[], links: AuthorLink[] }>({ nodes: [], links: [] });

  useEffect(() => {
    // Setup D3 force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(0, 0))
      .force('collision', d3.forceCollide().radius(15));

    simulation.on('tick', () => {
      setGraphData({ nodes: [...nodes], links: [...links] });
    });

    return () => { simulation.stop(); };
  }, [nodes, links]);

  return (
    <Canvas camera={{ position: [0, 0, 200] }} style={{ background: '#0D0D0F' }}>
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {graphData.links.map((link, index) => (
        <LinkLine key={index} link={link} />
      ))}

      {graphData.nodes.map((node, index) => (
        <Node key={index} node={node} />
      ))}
    </Canvas>
  );
};

const Node: React.FC<{ node: AuthorNode }> = ({ node }) => {
  const ref = useRef<THREE.Mesh>(null!);
  const color = d3.scaleOrdinal(d3.schemeCategory10).domain([node.genre]);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = node.x || 0;
      ref.current.position.y = node.y || 0;
      ref.current.position.z = node.z || 0;
    }
  });

  return (
    <mesh ref={ref}>
      <Sphere args={[5, 32, 32]}>
        <meshStandardMaterial color={color(node.genre)} emissive="#C9A962" />
      </Sphere>
    </mesh>
  );
};

const LinkLine: React.FC<{ link: AuthorLink }> = ({ link }) => {
  const source = typeof link.source === 'string' ? { x: 0, y: 0, z: 0 } : link.source;
  const target = typeof link.target === 'string' ? { x: 0, y: 0, z: 0 } : link.target;

  const points: [number, number, number][] = [
    [source.x || 0, source.y || 0, source.z || 0],
    [target.x || 0, target.y || 0, target.z || 0]
  ];

  return (
    <DreiLine points={points} color="#C9A962" lineWidth={1} />
  );
};

export default AuthorNetwork;
