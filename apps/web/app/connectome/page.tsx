'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';

interface Node {
  id: string;
  name: string;
  type: 'author' | 'text';
  language: 'greek' | 'latin';
  era: string;
  influence: number;
  totalConnections: number;
  works?: string[];
  author?: string;
  description: string;
}

interface Link {
  source: string;
  target: string;
  type: 'verbal' | 'thematic' | 'structural' | 'citation';
  strength: number;
  description: string;
  examples: Array<{
    sourceText: string;
    targetText: string;
    similarity: number;
  }>;
}

interface NetworkData {
  nodes: Node[];
  links: Link[];
  stats: {
    totalNodes: number;
    totalConnections: number;
    averageInfluence: number;
    networkDensity: number;
  };
}

interface RankingItem {
  id: string;
  name: string;
  type: 'author' | 'text';
  influence: number;
  connections: number;
  era: string;
}

export default function ConnectomePage() {
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [filteredData, setFilteredData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<Link | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectionFilters, setConnectionFilters] = useState<{
    verbal: boolean;
    thematic: boolean;
    structural: boolean;
    citation: boolean;
  }>({ verbal: true, thematic: true, structural: true, citation: true });
  const [nodeTypeFilter, setNodeTypeFilter] = useState<'all' | 'author' | 'text'>('all');
  const [languageFilter, setLanguageFilter] = useState<'all' | 'greek' | 'latin'>('all');
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [showRanking, setShowRanking] = useState(true);
  const [graphData, setGraphData] = useState<{nodes: any[], links: any[]}>({nodes: [], links: []});
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/connectome/network');
        if (!response.ok) {
          throw new Error('Failed to fetch network data');
        }
        const data: NetworkData = await response.json();
        setNetworkData(data);
        setFilteredData(data);
        
        // Generate ranking
        const allNodes = [...data.nodes];
        allNodes.sort((a, b) => b.influence - a.influence);
        const topRanking = allNodes.slice(0, 20).map(node => ({
          id: node.id,
          name: node.name,
          type: node.type,
          influence: node.influence,
          connections: node.totalConnections,
          era: node.era
        }));
        setRanking(topRanking);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load network data');
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkData();
  }, []);

  const filterData = useCallback(() => {
    if (!networkData) return;

    let filteredNodes = networkData.nodes.filter(node => {
      if (searchTerm && !node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (nodeTypeFilter !== 'all' && node.type !== nodeTypeFilter) {
        return false;
      }
      if (languageFilter !== 'all' && node.language !== languageFilter) {
        return false;
      }
      return true;
    });

    let filteredLinks = networkData.links.filter(link => {
      if (!connectionFilters[link.type]) {
        return false;
      }
      const sourceInFiltered = filteredNodes.some(n => n.id === link.source);
      const targetInFiltered = filteredNodes.some(n => n.id === link.target);
      return sourceInFiltered && targetInFiltered;
    });

    // Remove isolated nodes
    const connectedNodeIds = new Set<string>();
    filteredLinks.forEach(link => {
      connectedNodeIds.add(typeof link.source === 'string' ? link.source : link.source.toString());
      connectedNodeIds.add(typeof link.target === 'string' ? link.target : link.target.toString());
    });
    
    filteredNodes = filteredNodes.filter(node => connectedNodeIds.has(node.id));

    const newFilteredData = {
      nodes: filteredNodes,
      links: filteredLinks,
      stats: {
        totalNodes: filteredNodes.length,
        totalConnections: filteredLinks.length,
        averageInfluence: filteredNodes.length > 0 ? filteredNodes.reduce((sum, n) => sum + n.influence, 0) / filteredNodes.length : 0,
        networkDensity: filteredNodes.length > 1 ? (filteredLinks.length * 2) / (filteredNodes.length * (filteredNodes.length - 1)) : 0
      }
    };

    setFilteredData(newFilteredData);
    setGraphData({
      nodes: filteredNodes.map(node => ({
        ...node,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: 0,
        vy: 0
      })),
      links: filteredLinks
    });
  }, [networkData, searchTerm, connectionFilters, nodeTypeFilter, languageFilter, dimensions]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('graph-container');
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    setSelectedConnection(null);
    setShowDetails(true);
  };

  const handleLinkClick = (link: Link) => {
    setSelectedConnection(link);
    setSelectedNode(null);
    setShowDetails(true);
  };

  const getNodeColor = (node: Node) => {
    return node.language === 'greek' ? '#5BA4E8' : '#E85B5B';
  };

  const getNodeSize = (node: Node) => {
    return Math.max(6, Math.min(25, node.influence * 30));
  };

  const getLinkColor = (link: Link) => {
    const colors = {
      verbal: '#C9A962',
      thematic: '#5BA4E8',
      structural: '#E85B5B',
      citation: '#90EE90'
    };
    return colors[link.type];
  };

  const handleFilterChange = (type: keyof typeof connectionFilters) => {
    setConnectionFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const resetFilters = () => {
    setConnectionFilters({ verbal: true, thematic: true, structural: true, citation: true });
    setNodeTypeFilter('all');
    setLanguageFilter('all');
    setSearchTerm('');
  };

  const renderSimpleGraph = () => {
    if (!graphData.nodes.length) return null;

    return (
      <svg width={dimensions.width} height={dimensions.height} className="w-full h-full">
        {/* Links */}
        {graphData.links.map((link, index) => {
          const sourceNode = graphData.nodes.find(n => n.id === link.source);
          const targetNode = graphData.nodes.find(n => n.id === link.target);
          if (!sourceNode || !targetNode) return null;
          
          return (
            <line
              key={index}
              x1={sourceNode.x || dimensions.width / 2}
              y1={sourceNode.y || dimensions.height / 2}
              x2={targetNode.x || dimensions.width / 2}
              y2={targetNode.y || dimensions.height / 2}
              stroke={getLinkColor(link)}
              strokeWidth={Math.max(1, link.strength * 3)}
              opacity={0.6}
              onClick={() => handleLinkClick(link)}
              className="cursor-pointer hover:opacity-100"
            />
          );
        })}
        
        {/* Nodes */}
        {graphData.nodes.map((node, index) => (
          <g key={node.id}>
            <circle
              cx={node.x || dimensions.width / 2}
              cy={node.y || dimensions.height / 2}
              r={getNodeSize(node)}
              fill={getNodeColor(node)}
              stroke="#F5F3EF"
              strokeWidth={1}
              onClick={() => handleNodeClick(node)}
              className="cursor-pointer hover:stroke-[#C9A962] hover:stroke-2"
            />
            <text
              x={node.x || dimensions.width / 2}
              y={(node.y || dimensions.height / 2) + getNodeSize(node) + 12}
              textAnchor="middle"
              fill="#F5F3EF"
              fontSize="10"
              className="pointer-events-none font-serif"
            >
              {node.name.length > 15 ? node.name.substring(0, 15) + '...' : node.name}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-2 border-[#C9A962]/20 border-t-[#C9A962] rounded-full mx-auto mb-4"></div>
          <p className="text-[#F5F3EF]/70">Loading intertextual network...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#E85B5B] mb-4">Error loading connectome: {error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold hover:bg-[#C9A962]/90 transition-all">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Navigation */}
      <nav className="border-b border-[#C9A962]/20 bg-[#0D0D0F]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/reader" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Reader</Link>
                <Link href="/semantia" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">SEMANTIA</Link>
                <Link href="/translate" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Translate</Link>
                <Link href="/connectome" className="text-[#C9A962] font-semibold">Connectome</Link>
                <Link href="/learn" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Learn</Link>
                <Link href="/discovery" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Discovery</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Controls */}
        <div className="w-80 bg-[#C9A962]/5 border-r border-[#C9A962]/20 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#C9A962] mb-2 font-serif">Connectome</h1>
            <p className="text-[#F5F3EF]/70 text-sm