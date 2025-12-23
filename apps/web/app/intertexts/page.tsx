'use client';
import React, { useState } from 'react';

const API_URL = 'https://logos-production-ef2b.up.railway.app';

interface Connection {
  id: string;
  sourceUrn: string;
  targetUrn: string;
  sourceText: string;
  targetText: string;
  connectionType: 'verbal' | 'thematic' | 'structural' | 'polemic';
  similarityScore: number;
  direction: 'source' | 'target';
}

interface NetworkNode {
  id: string;
  urn: string;
  title: string;
  x: number;
  y: number;
}

const IntertextualityExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['verbal', 'thematic', 'structural', 'polemic']);
  const [loading, setLoading] = useState(false);
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([]);

  // Demo data
  const demoConnections: Connection[] = [
    {
      id: '1',
      sourceUrn: 'urn:cts:latinLit:stoa0295.stoa001.opp-lat1:1.1',
      targetUrn: 'urn:cts:greekLit:tlg0012.tlg001.msA:1.1',
      sourceText: 'Arma virumque cano, Troiae qui primus ab oris',
      targetText: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος',
      connectionType: 'verbal',
      similarityScore: 85,
      direction: 'target'
    },
    {
      id: '2',
      sourceUrn: 'urn:cts:latinLit:stoa0295.stoa001.opp-lat1:1.1',
      targetUrn: 'urn:cts:greekLit:tlg0012.tlg002.msA:1.1',
      sourceText: 'Arma virumque cano, Troiae qui primus ab oris',
      targetText: 'ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον, ὃς μάλα πολλὰ',
      connectionType: 'thematic',
      similarityScore: 92,
      direction: 'target'
    }
  ];

  const demoNodes: NetworkNode[] = [
    { id: '1', urn: 'urn:cts:latinLit:stoa0295.stoa001.opp-lat1:1.1', title: 'Aeneid 1.1', x: 300, y: 200 },
    { id: '2', urn: 'urn:cts:greekLit:tlg0012.tlg001.msA:1.1', title: 'Iliad 1.1', x: 100, y: 100 },
    { id: '3', urn: 'urn:cts:greekLit:tlg0012.tlg002.msA:1.1', title: 'Odyssey 1.1', x: 500, y: 100 }
  ];

  React.useEffect(() => {
    // Initialize with demo data
    setConnections(demoConnections);
    setFilteredConnections(demoConnections);
    setNetworkNodes(demoNodes);
  }, []);

  React.useEffect(() => {
    const filtered = connections.filter(conn => 
      selectedFilters.includes(conn.connectionType)
    );
    setFilteredConnections(filtered);
  }, [connections, selectedFilters]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      // For demo purposes, use demo data
      if (searchTerm.includes('aeneid') || searchTerm.includes('1.1')) {
        setConnections(demoConnections);
        setNetworkNodes(demoNodes);
      } else {
        setConnections([]);
        setNetworkNodes([]);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterType)
        ? prev.filter(f => f !== filterType)
        : [...prev, filterType]
    );
  };

  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case 'verbal': return '#C9A227';
      case 'thematic': return '#4CAF50';
      case 'structural': return '#2196F3';
      case 'polemic': return '#F44336';
      default: return '#C9A227';
    }
  };

  const getConnectionLines = () => {
    const lines = [];
    filteredConnections.forEach((conn, index) => {
      const sourceNode = networkNodes.find(n => n.urn === conn.sourceUrn);
      const targetNode = networkNodes.find(n => n.urn === conn.targetUrn);
      
      if (sourceNode && targetNode) {
        lines.push(
          <line
            key={`line-${index}`}
            x1={sourceNode.x + 75}
            y1={sourceNode.y + 40}
            x2={targetNode.x + 75}
            y2={targetNode.y + 40}
            stroke={getConnectionTypeColor(conn.connectionType)}
            strokeWidth="2"
            opacity="0.7"
          />
        );
      }
    });
    return lines;
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-[#C9A227] mb-2">Intertextuality Explorer</h1>
          <p className="text-lg text-gray-300">Discover connections between ancient texts</p>
        </header>

        {/* Search Section */}
        <div className="bg-[#1A1A1C] rounded-lg p-6 mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Enter passage URN or search text (try 'aeneid 1.1')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-[#2A2A2E] border border-gray-600 rounded-lg px-4 py-3 text-[#F5F4F2] focus:outline-none focus:border-[#C9A227]"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-[#C9A227] hover:bg-[#A68420] disabled:opacity-50 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {['verbal', 'thematic', 'structural', 'polemic'].map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(type)}
                  onChange={() => handleFilterChange(type)}
                  className="w-4 h-4 text-[#C9A227] bg-[#2A2A2E] border-gray-600 rounded focus:ring-[#C9A227] focus:ring-2"
                />
                <span className="text-sm capitalize" style={{ color: getConnectionTypeColor(type) }}>
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Results List */}
          <div className="bg-[#1A1A1C] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#C9A227] mb-4">
              Connections ({filteredConnections.length})
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredConnections.map((connection) => (
                <div
                  key={connection.id}
                  className="bg-[#2A2A2E] rounded-lg p-4 border-l-4"
                  style={{ borderLeftColor: getConnectionTypeColor(connection.connectionType) }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold text-black"
                        style={{ backgroundColor: getConnectionTypeColor(connection.connectionType) }}
                      >
                        {connection.connectionType.toUpperCase()}
                      </span>
                      <span className="text-[#C9A227] font-bold">
                        {connection.similarityScore}%
                      </span>
                      <span className="text-xs text-gray-400 uppercase">
                        {connection.direction}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <div className="text-gray-400 text-xs mb-1">Source:</div>
                      <div className="font-mono text-xs text-gray-500 mb-1">{connection.sourceUrn}</div>
                      <div className="text-[#F5F4F2]">{connection.sourceText}</div>
                    </div>
                    
                    <div>
                      <div className="text-gray-400 text-xs mb-1">Target:</div>
                      <div className="font-mono text-xs text-gray-500 mb-1">{connection.targetUrn}</div>
                      <div className="text-[#F5F4F2]">{connection.targetText}</div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredConnections.length === 0 && !loading && (
                <div className="text-center text-gray-400 py-8">
                  No connections found. Try searching for "aeneid 1.1" to see demo data.
                </div>
              )}
            </div>
          </div>

          {/* Network Visualization */}
          <div className="bg-[#1A1A1C] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#C9A227] mb-4">Network View</h2>
            
            <div className="relative bg-[#2A2A2E] rounded-lg h-96 overflow-hidden">
              <svg className="absolute inset-0 w-full h-full">
                {getConnectionLines()}
              </svg>
              
              {networkNodes.map((node) => (
                <div
                  key={node.id}
                  className="absolute bg-[#C9A227] text-black px-3 py-2 rounded-lg text-sm font-semibold shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:bg-[#A68420] transition-colors"
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    width: '150px',
                    textAlign: 'center'
                  }}
                  title={node.urn}
                >
                  {node.title}
                </div>
              ))}
              
              {networkNodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Network visualization will appear here
                </div>
              )}
            </div>
            
            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {['verbal', 'thematic', 'structural', 'polemic'].map(type => (
                <div key={type} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: getConnectionTypeColor(type) }}
                  ></div>
                  <span className="capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntertextualityExplorer;