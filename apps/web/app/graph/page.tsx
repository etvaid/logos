'use client';
import React, { useState, useRef, useEffect } from 'react';

const API_URL = 'https://logos-production-ef2b.up.railway.app';

interface Entity {
  id: string;
  name: string;
  type: string;
  description?: string;
  properties?: Record<string, any>;
  connections?: Connection[];
}

interface Connection {
  id: string;
  name: string;
  type: string;
  relationship: string;
}

interface Position {
  x: number;
  y: number;
}

export default function KnowledgeGraphExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [naturalQuery, setNaturalQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [entities, setEntities] = useState<Map<string, Entity & Position>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock data for demo
  const mockEntities = {
    'homer': {
      id: 'homer',
      name: 'Homer',
      type: 'Person',
      description: 'Ancient Greek epic poet, traditionally said to be the author of the Iliad and the Odyssey.',
      properties: {
        born: 'c. 8th century BC',
        nationality: 'Greek',
        occupation: 'Poet',
        works: ['Iliad', 'Odyssey']
      },
      connections: [
        { id: 'virgil', name: 'Virgil', type: 'Person', relationship: 'influenced' }
      ]
    },
    'virgil': {
      id: 'virgil',
      name: 'Virgil',
      type: 'Person',
      description: 'Roman poet of the Augustan period, best known for his national epic, the Aeneid.',
      properties: {
        born: '70 BC',
        died: '19 BC',
        nationality: 'Roman',
        occupation: 'Poet',
        works: ['Aeneid', 'Eclogues', 'Georgics']
      },
      connections: [
        { id: 'homer', name: 'Homer', type: 'Person', relationship: 'influenced by' },
        { id: 'dante', name: 'Dante', type: 'Person', relationship: 'influenced' }
      ]
    },
    'dante': {
      id: 'dante',
      name: 'Dante Alighieri',
      type: 'Person',
      description: 'Italian poet, writer and philosopher, best known for the Divine Comedy.',
      properties: {
        born: '1265',
        died: '1321',
        nationality: 'Italian',
        occupation: 'Poet, Philosopher',
        works: ['Divine Comedy', 'Vita Nuova']
      },
      connections: [
        { id: 'virgil', name: 'Virgil', type: 'Person', relationship: 'influenced by' }
      ]
    },
    'augustine': {
      id: 'augustine',
      name: 'Augustine of Hippo',
      type: 'Person',
      description: 'Christian theologian and philosopher whose writings influenced the development of Western Christianity.',
      properties: {
        born: '354 AD',
        died: '430 AD',
        nationality: 'Roman',
        occupation: 'Theologian, Philosopher',
        works: ['Confessions', 'City of God']
      },
      connections: [
        { id: 'plato', name: 'Plato', type: 'Person', relationship: 'influenced by' },
        { id: 'aquinas', name: 'Thomas Aquinas', type: 'Person', relationship: 'influenced' }
      ]
    }
  };

  const searchEntity = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Mock API call - replace with actual API
      const entityKey = query.toLowerCase();
      const mockEntity = mockEntities[entityKey as keyof typeof mockEntities];
      
      if (mockEntity) {
        const position = { x: 200 + entities.size * 150, y: 200 };
        const entityWithPosition = { ...mockEntity, ...position };
        
        setEntities(prev => new Map(prev.set(mockEntity.id, entityWithPosition)));
        setSelectedEntity(mockEntity);
        
        // Auto-load connections for demo
        if (entityKey === 'homer') {
          setTimeout(() => addConnection('virgil'), 500);
        } else if (entityKey === 'virgil' && !entities.has('dante')) {
          setTimeout(() => addConnection('dante'), 500);
        }
      } else {
        setError('Entity not found in demo data');
      }
    } catch (err) {
      setError('Failed to search entity');
    } finally {
      setLoading(false);
    }
  };

  const addConnection = (entityId: string) => {
    const mockEntity = mockEntities[entityId as keyof typeof mockEntities];
    if (mockEntity && !entities.has(entityId)) {
      const position = { x: 200 + entities.size * 200, y: 200 };
      const entityWithPosition = { ...mockEntity, ...position };
      setEntities(prev => new Map(prev.set(entityId, entityWithPosition)));
    }
  };

  const processNaturalQuery = async () => {
    if (!naturalQuery.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Mock natural language processing
      if (naturalQuery.toLowerCase().includes('influenced augustine')) {
        await searchEntity('augustine');
        setTimeout(() => addConnection('plato'), 1000);
      } else if (naturalQuery.toLowerCase().includes('homer')) {
        await searchEntity('homer');
      } else {
        setError('Try asking "Who influenced Augustine?" or search for "Homer"');
      }
    } catch (err) {
      setError('Failed to process query');
    } finally {
      setLoading(false);
    }
  };

  const drawConnections = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    
    const entitiesArray = Array.from(entities.values());
    
    entitiesArray.forEach(entity => {
      entity.connections?.forEach(connection => {
        const connectedEntity = entities.get(connection.id);
        if (connectedEntity) {
          ctx.beginPath();
          ctx.moveTo(entity.x + 150, entity.y + 50);
          ctx.lineTo(connectedEntity.x + 150, connectedEntity.y + 50);
          ctx.stroke();
          
          // Draw relationship label
          const midX = (entity.x + connectedEntity.x) / 2 + 150;
          const midY = (entity.y + connectedEntity.y) / 2 + 50;
          ctx.fillStyle = '#a855f7';
          ctx.font = '12px Inter';
          ctx.fillText(connection.relationship, midX - 30, midY - 5);
        }
      });
    });
  };

  useEffect(() => {
    drawConnections();
  }, [entities]);

  const loadDemo = () => {
    setEntities(new Map());
    setSelectedEntity(null);
    searchEntity('homer');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Knowledge Graph Explorer
        </h1>
        
        {/* Search Controls */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Entity Search</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Homer, Virgil, Dante, Augustine..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && searchEntity(searchQuery)}
                />
                <button
                  onClick={() => searchEntity(searchQuery)}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Natural Language Query</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={naturalQuery}
                  onChange={(e) => setNaturalQuery(e.target.value)}
                  placeholder="Who influenced Augustine?"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyPress={(e) => e.key === 'Enter' && processNaturalQuery()}
                />
                <button
                  onClick={processNaturalQuery}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded font-medium transition-colors"
                >
                  Ask
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={loadDemo}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-medium transition-colors"
            >
              Demo: Homer → Virgil → Dante
            </button>
            <button
              onClick={() => setEntities(new Map())}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded font-medium transition-colors"
            >
              Clear Graph
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded text-red-200">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Entity Details */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Entity Details</h2>
            {selectedEntity ? (
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">
                  {selectedEntity.name}
                </h3>
                <p className="text-sm text-gray-400 mb-3">Type: {selectedEntity.type}</p>
                {selectedEntity.description && (
                  <p className="text-gray-300 mb-4">{selectedEntity.description}</p>
                )}
                
                {selectedEntity.properties && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Properties:</h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(selectedEntity.properties).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-400">{key}:</span>
                          <span className="text-gray-300">
                            {Array.isArray(value) ? value.join(', ') : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedEntity.connections && selectedEntity.connections.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Connections:</h4>
                    <div className="space-y-2">
                      {selectedEntity.connections.map((conn) => (
                        <div
                          key={conn.id}
                          className="flex items-center justify-between p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
                          onClick={() => addConnection(conn.id)}
                        >
                          <span>{conn.name}</span>
                          <span className="text-xs text-purple-400">{conn.relationship}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-400">Search for an entity to see details</p>
            )}
          </div>

          {/* Graph Visualization */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Knowledge Graph</h2>
            <div className="relative bg-gray-900 rounded-lg h-96 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="absolute inset-0"
              />
              
              {Array.from(entities.values()).map((entity) => (
                <div
                  key={entity.id}
                  className={`absolute bg-gray-700 border-2 rounded-lg p-3 cursor-pointer transition-all hover:scale-105 ${
                    selectedEntity?.id === entity.id 
                      ? 'border-blue-500 bg-gray-600' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  style={{
                    left: entity.x,
                    top: entity.y,
                    width: '300px'
                  }}
                  onClick={() => setSelectedEntity(entity)}
                >
                  <h4 className="font-semibold text-blue-400">{entity.name}</h4>
                  <p className="text-xs text-gray-400">{entity.type}</p>
                  {entity.description && (
                    <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                      {entity.description.substring(0, 100)}...
                    </p>
                  )}
                </div>
              ))}
              
              {entities.size === 0 && (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Search for entities to build your knowledge graph
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}