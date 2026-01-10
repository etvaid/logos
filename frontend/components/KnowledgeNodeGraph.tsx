'use client';

import React, { useState, useEffect } from 'react';

interface Node {
  id: string;
  label: string;
  type: string;
  facet?: string;
  passage_count?: number;
}

interface Link {
  source: string;
  target: string;
  strength: number;
}

interface KnowledgeNodeGraphProps {
  centerNodeId?: string;
  urn?: string;
  maxNodes?: number;
}

const NODE_COLORS: { [key: string]: string } = {
  event: '#DC143C',
  institution: '#4169E1',
  polity: '#8B4513',
  concept: '#9370DB',
  place: '#2E8B57',
  astronomy_concept: '#191970',
  philosophy_concept: '#4169E1',
  default: '#666666'
};

export default function KnowledgeNodeGraph({
  centerNodeId,
  urn,
  maxNodes = 20
}: KnowledgeNodeGraphProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    async function loadGraph() {
      try {
        if (centerNodeId) {
          // Load node and its related nodes
          const response = await fetch(`/api/lens/nodes?node_id=${centerNodeId}&action=details`);
          const data = await response.json();

          if (data.node && data.related_nodes) {
            const centerNode: Node = {
              id: data.node.id,
              label: data.node.label,
              type: data.node.type,
              facet: data.node.facet,
              passage_count: data.statistics?.linked_passages
            };

            const relatedNodes: Node[] = data.related_nodes.slice(0, maxNodes - 1).map((n: any) => ({
              id: n.id,
              label: n.label,
              type: n.type,
              facet: n.facet,
              passage_count: n.shared_passages
            }));

            const graphLinks: Link[] = relatedNodes.map(n => ({
              source: centerNode.id,
              target: n.id,
              strength: n.passage_count || 1
            }));

            setNodes([centerNode, ...relatedNodes]);
            setLinks(graphLinks);
          }
        } else if (urn) {
          // Load nodes linked to URN
          const response = await fetch(`/api/lens?urn=${encodeURIComponent(urn)}`);
          const data = await response.json();

          if (data.nodes) {
            const graphNodes: Node[] = data.nodes.slice(0, maxNodes).map((n: any) => ({
              id: n.node_id,
              label: n.label,
              type: n.type,
              facet: n.facet,
              passage_count: 1
            }));

            setNodes(graphNodes);
            setLinks([]);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Failed to load knowledge graph:', err);
        setLoading(false);
      }
    }

    loadGraph();
  }, [centerNodeId, urn, maxNodes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading knowledge graph...</div>
        </div>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="text-center p-12 bg-gray-50 rounded-lg">
        <div className="text-gray-500">No knowledge nodes found</div>
      </div>
    );
  }

  // Simple force-directed layout (circular for simplicity)
  const radius = 180;
  const centerX = 250;
  const centerY = 250;

  const nodePositions = nodes.map((node, index) => {
    if (index === 0 && centerNodeId) {
      // Center node
      return { x: centerX, y: centerY };
    }

    // Arrange other nodes in circle
    const adjustedIndex = centerNodeId ? index - 1 : index;
    const totalNodes = centerNodeId ? nodes.length - 1 : nodes.length;
    const angle = (adjustedIndex / totalNodes) * 2 * Math.PI;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Knowledge Graph</h2>
        <div className="text-sm text-gray-600">
          {centerNodeId ? 'Related concepts and entities' : `${nodes.length} connected nodes`}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Graph Visualization */}
        <div className="flex-1">
          <svg width="500" height="500" viewBox="0 0 500 500" className="border rounded">
            {/* Draw links */}
            {links.map((link, idx) => {
              const sourceIdx = nodes.findIndex(n => n.id === link.source);
              const targetIdx = nodes.findIndex(n => n.id === link.target);

              if (sourceIdx === -1 || targetIdx === -1) return null;

              const sourcePos = nodePositions[sourceIdx];
              const targetPos = nodePositions[targetIdx];

              return (
                <line
                  key={idx}
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke="#cbd5e0"
                  strokeWidth={Math.max(1, link.strength / 2)}
                  opacity="0.6"
                />
              );
            })}

            {/* Draw nodes */}
            {nodes.map((node, idx) => {
              const pos = nodePositions[idx];
              const isCenter = idx === 0 && centerNodeId;
              const isHovered = hoveredNode === node.id;
              const isSelected = selectedNode?.id === node.id;
              const color = NODE_COLORS[node.type] || NODE_COLORS.default;
              const size = isCenter ? 20 : (isHovered || isSelected ? 15 : 10);

              return (
                <g
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setSelectedNode(node)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Node circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={size}
                    fill={color}
                    stroke={isSelected ? '#fbbf24' : isHovered ? '#60a5fa' : 'white'}
                    strokeWidth={isSelected ? 3 : 2}
                    opacity={hoveredNode && hoveredNode !== node.id ? 0.4 : 1}
                  />

                  {/* Node label */}
                  {(isCenter || isHovered || isSelected) && (
                    <text
                      x={pos.x}
                      y={pos.y + size + 15}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="bold"
                      fill={color}
                    >
                      {node.label.length > 20 ? node.label.substring(0, 18) + '...' : node.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Node Details Panel */}
        <div className="w-64">
          {selectedNode ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-3" style={{ color: NODE_COLORS[selectedNode.type] }}>
                {selectedNode.label}
              </h3>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-gray-600">Type:</span>
                  <span className="ml-2">{selectedNode.type.replace(/_/g, ' ')}</span>
                </div>

                {selectedNode.facet && (
                  <div>
                    <span className="font-semibold text-gray-600">Facet:</span>
                    <span className="ml-2 capitalize">{selectedNode.facet}</span>
                  </div>
                )}

                {selectedNode.passage_count && (
                  <div>
                    <span className="font-semibold text-gray-600">Passages:</span>
                    <span className="ml-2">{selectedNode.passage_count}</span>
                  </div>
                )}

                <button
                  onClick={() => window.open(`/api/lens/nodes?node_id=${selectedNode.id}&action=details`, '_blank')}
                  className="mt-4 w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                >
                  Explore Node
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
              Click a node to see details
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Node Types</h4>
            <div className="space-y-1 text-xs">
              {Object.entries(NODE_COLORS).filter(([k]) => k !== 'default').map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="capitalize">{type.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
